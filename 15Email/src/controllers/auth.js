const bcript = require( 'bcryptjs' );
const nodemailer = require( 'nodemailer' );
const sendgridTransport = require( 'nodemailer-sendgrid-transport' );

const User = require( '../models/user' );

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
        api_key :'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'
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
                        from : 'shop@hoon-node-complete.com',
                        subject : 'Signup succeeded!',
                        html : '<h1>You successfully signed up!</h1>'
                    } );
                } )
                .catch( err => console.log( '<<sendEmailErr>>' , err ) );
        } )
        .catch( err => console.log( '<<postSignupErr>>' , err ) );
};