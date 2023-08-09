const crypto = require( 'crypto' );

const bcript = require( 'bcryptjs' );
const nodemailer = require( 'nodemailer' );
const sendgridTransport = require( 'nodemailer-sendgrid-transport' );
const { validationResult } = require( 'express-validator' );
const Constants = require( '../constants/private.ts' );

const User = require( '../models/user' );
const {logger} = require("sequelize/lib/utils/logger");

/**
 * - createTransport 에 sendgridTransport 의 환경값을 설정한다
 *
 * --> 즉, createTransport 에서 sendgridTransport 패키지를 이용해 메일을 보낸다
 *
 * --> transporter 객체를 생성할때, auth 의 api_user , api_key 가 필요한데 Send_Grid 계정 에서 확인할 수 있다
 *
 * @see ( https://sendgrid.com/ )
 */
const transporter = nodemailer.createTransport( sendgridTransport( {
    auth : {
        api_key :Constants.EMAIL_API_KEY,
    }
} ) );

/**
 * - get Login
 *
 * --> 로그인 정보 페이지 반환
 *
 * @param req
 * @param res
 * @param next
 */
exports.getLogin = ( req , res , next ) => {
    let [ message ] = req.flash('error');
    if ( !message ){
        message = null;
    }
    res.render( 'auth/login' , {
        pageTitle : 'Login' ,
        path : '/login' ,
        /** 이렇게 사용하면, 일회성 데이터는 더이상 세션에 존재하지 않게된다 */
        errorMessage : message
    } );
}

/**
 * - post Login
 *
 * --> 로그인 정보 요청 controller
 *
 * @param req
 * @param res
 * @param next
 */
exports.postLogin = ( req , res , next ) => {

    const { email , password } = req.body;

    /** 로그인시 사용한 email 과 매치되는 유저를 찾음 */
    User.findOne( { email } )
        .then( user =>{
            /** 해당하는 user 를 찾지못했다면 login 페이지로 보낸다 */
            if ( !user ){
                /** flash 에 key , value 형태로 등록 */
                req.flash( 'error' , 'Invalid email or password.' );
                return res.redirect( '/login' );
            }

            /**
             * - 첫 번째 파라미터로 암호화되지 않은 string 을 사용하고,
             *
             * - 두 번째 파라미터로 암호화된 string 을 사용한다
             *
             * @return { Promise<boolean> } - 같은 값인지 체크 여부를 반환한다
             */
            bcript
                .compare( password , user.password )
                .then( doMatch => {
                    /** password 가 일치할 경우에만 세션에 login 데이터 설정 및 / 로 리다이렉트 */
                    if ( doMatch ){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        /** 더이상 아래코드가 실행되지 못하도록 return! */
                        return req.session.save( ( err ) =>{
                            console.log( '<<saveUserInfo Session success>>' , err );
                            return res.redirect( '/' );
                        } );
                    }
                    req.flash( 'error' , 'Invalid email or password.' );
                    res.redirect( '/login' );
                } )
                .catch( err => {
                    console.log( '<<postLoginCompareErr>>' , err );
                    res.redirect( '/login' );
                } )
        } )
        .catch( err => console.log( '<<postLoginErr>>' , err ) );
}

/**
 * - post Logout
 *
 * --> 로그아웃 controller
 *
 * @param req
 * @param res
 * @param next
 */
exports.postLogout = ( req , res , next ) => {
    /**
     * 해당 세션 제거
     * --> 파라미터로 세션이 제거된 후 실행할 callback 을 넘길 수 있다
     * --> 이 시점에서 session 은 파괴되어 있다
     */
    req.session.destroy( err => {
        console.log( '<<logout redirect>>' , err );
        res.redirect( '/' );
    } );
}

/**
 * - 회원가입 페이지 반환 controller
 * @param req
 * @param res
 * @param next
 */
exports.getSignup = (req, res, next) => {
    let [ message ] = req.flash('error');
    if ( !message ){
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage : message,
    });
};

/**
 * - 회원가입 요청 controller
 * @param req
 * @param res
 * @param next
 */
exports.postSignup = (req, res, next) => {
    const { email , password , confirmPassword } = req.body;
    /**
     * - express-validator 미들웨어에서 발생한 에러를 모아주어, errors 변수에저장
     * */
    const errors = validationResult( req );
    /** 에러가 존재하는지 여부를 반환하는 메서드 - 에러가 존재할 시 에러코드 반환 */
    if ( !errors.isEmpty() ){
        /** 에러 코드를 반환하고, signup 페이지를 다시 렌더링한다 */
        console.log( '<< postSignup validator errors.array() >> :' , errors.array() );
        return res.status( 422 ).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage : errors.array(),
        });
    }

    User.findOne( { email } )
        .then( userDoc => {
            /**
             * - 해당 email 을 가진 사용자가 있다면,
             *   해당 사용자를 생성하지 말아야 한다
             */
            if ( userDoc ){
                req.flash( 'error' , 'E-Mail exists already, please pick a different one.' );
                return res.redirect( '/signup' );
            }
            /**
             * - hash 화 하고싶은 문자열을 첫 번째 인자로 넘겨준다
             *
             * - 두 번째는 몇 차례의 해싱을 적용할 것인지 지정한다
             *   ( 솔트 값이 높을수록 오래걸리지만, 더 안전하다 )
             *
             * - 12 정도면 높은 보안성능으로 간주된다
             *
             * @return { Promise<string> } - 비동기 해쉬 string 값을 반환한다
             */
            return bcript
                .hash( password , 12 )
                .then( ( hashedPassword ) => {
                    /** 그외의 경우 사용자를 생성하여 저장 */
                    const user = new User( {
                        email ,
                        password : hashedPassword,
                        cart : { items : [] }
                    } );
                    return user.save();
                } )
                .then( () => {
                    /** 사용자가 로그인 */
                    res.redirect( '/login' );
                    return transporter.sendMail( {
                        to : email,
                        from : 'divinity666@naver.com',
                        subject : 'Signup succeeded!',
                        html : '<h1>You successfully signed up!</h1>'
                    } );
                } )
                .catch( err => console.log( '<<sendEmailErr>>' , err ) );
        } )
        .catch( err => console.log( '<<postSignupErr>>' , err ) );
};

/**
 * - 비밀번호 재설정 메일 요청 get controller
 * @param req
 * @param res
 * @param next
 */
exports.getReset = ( req , res , next ) => {
    let [ message ] = req.flash('error');
    if ( !message ){
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage : message,
    });
}

/**
 * - 비밀번호 재설정 메일 요청 post controller
 * @param req
 * @param res
 * @param next
 */
exports.postReset = ( req , res , next ) => {
    /**
     * - 32 개의 무작위 바이트 생성
     *
     * - 생성 후 2번째 콜백을 실행하게 된다
     */
    crypto.randomBytes( 32 , ( err , buffer ) => {
        /** error 발생시 다시 리다이렉트 */
        if ( err ){
            console.log( '<< postReset error >>' , err );
            return res.redirect( './reset' );
        }
        /** 16 진법을 이용하여 buffer token 생성 */
        const token = buffer.toString( 'hex' );

        /** 일치하는 Email 로 DB 의 사용자 조회 */
        User.findOne( { email : req.body.email } )
            .then( user => {
                if ( !user ){
                    /** error flash 등록 */
                    req.flash( 'error' , 'No account with that email found.' );
                    return res.redirect( '/reset' );
                }
                /**
                 * - 찾은 사용자 데이터에 resetToken 설정
                 *   ( 한시간동안 토큰 만료시간 설정 )
                 */
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            } )
            .then( result => {
                res.redirect( '/' );
                /** 비밀번호 재설정 이메일 발신 */
                transporter.sendMail( {
                    to : req.body.email,
                    from : 'divinity666@naver.com',
                    subject : 'Password reset',
                    html : `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${ token }">link</a> to set a new password.</p>
                    `
                } );
            } )
            .catch( err => {
                console.log( '<<postReset err>>' , err );
            } );
    });
}

/**
 * - 비밀번호 실제 재설정 get controller
 * @param req
 * @param res
 * @param next
 */
exports.getNewPassword = ( req , res , next ) => {
    const token = req.params.token;

    /**
     * - token 을 이용해 해당 token 과 일치하고,
     *
     *   token 만료일자가 지나지 않은 사용자를 찾는다
     *
     * @resetTokenExpiration :
     *  - $gt : 보다 크다는 뜻,
     *    즉, 현재시각( Date.now() ) 보다
     *
     *  - 토큰 만료일자가 더 큰 사용자를 찾는다는 뜻
     */
    User.findOne( {
            resetToken : token ,
            resetTokenExpiration : {
                /** $gt 는 보다 크다는 뜻 */
                $gt : Date.now()
            }
        } )
        .then( user => {
            let [ message ] = req.flash('error');
            if ( !message ){
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage : message,
                /** ObjectId 에서 실제 string 으로 변경 */
                userId : user._id.toString(),
                passwordToken : token,
            });
        } )
        .catch( err => console.log( '<<finUserErr>>' , err ) );
}

/**
 * - 비밀번호 업데이트 controller
 * @param req
 * @param res
 * @param next
 */
exports.postNewPassword = ( req , res , next ) => {
    const { password , userId , passwordToken } = req.body;
    let resetUser;

    User.findOne( {
        resetToken : passwordToken ,
        resetTokenExpiration : {
            $gt : Date.now()
        },
        _id : userId
    } )
        .then( user => {
            resetUser = user;
            /**
             * - hash 화 하고싶은 문자열을 첫 번째 인자로 넘겨준다
             *
             * - 두 번째는 몇 차례의 해싱을 적용할 것인지 지정한다
             *   ( 솔트 값이 높을수록 오래걸리지만, 더 안전하다 )
             *
             * - 12 정도면 높은 보안성능으로 간주된다
             *
             * @return { Promise<string> } - 비동기 해쉬 string 값을 반환한다
             */
            return bcript.hash( password , 12 );
        } )
        .then( hashedPassword => {
            resetUser.password = hashedPassword;
            /**
             * - token 필드 제거( undefined )
             */
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        } )
        .then( result => {
            res.redirect( '/login' );
        } )
        .catch( err => console.log( '<<finUserErr>>' , err ) )
}