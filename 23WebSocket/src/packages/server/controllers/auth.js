const { validationResult } = require( 'express-validator' );
const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../models/user' );

/**
 * - 회원 가입 Controller
 * @param req
 * @param res
 * @param next
 */
exports.signup = async ( req , res , next ) => {
    const errors = validationResult( req );
    /** route validation 에서 체크한 에러가 존재할 경우 */
    if ( !errors.isEmpty() ){
        const error = new Error( 'Validation failed.' );
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const { email , name , password } = req.body;
    try {
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
        /** password 를 암호화하고 저장한 후, 응답 값 반환 */
        const hashedPw = await bcrypt.hash( password , 12 );

        const user = new User( {
            email ,
            password : hashedPw,
            name
        } );

        const result = await user.save();

        res.status( 201 ).json( { message : 'User created!' , userId : result._id } );
    }
    catch( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
}

/**
 * - 로그인 Controller
 * @param req
 * @param res
 * @param next
 */
exports.login = async ( req , res , next ) => {
    const { email , password } = req.body;
    let loadedUser;

    try {
        /** 해당 email 이 존재하는지 체크 */
        const user = await User.findOne( { email } );

        /** DB 에 해당 User 가 존재하지 않는다면 에러처리 */
        if ( !user ) {
            const error = new Error( 'A user with this email could not be found.' );
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;

        /** 사용자의 password 와 DB password 를 검사한다 */
        const isEqual = await bcrypt.compare( password , user.password );

        /** 사용자가 비밀번호를 잘못 입력했을 경우 */
        if ( !isEqual ){
            const error = new Error( 'A user with this email could not be found.' );
            error.statusCode = 401;
            throw error;
        }

        /** 비밀번호 까지 맞다면 JWT( JSON Web Token )생성 */

        /**
         * - sign 메서드를 이용해 새로운 서명( 시그니처 )생성
         *
         * @param { any } payload - 토큰에 이메일, 사용자 아이디등등
         *   ( 그러나, 비밀번호를 포함하는것은 보안상 좋지 않다 )
         *
         * @param { string } secretOrPrivateKey - 서명에 사용할 private key 를 사용한다
         *                                        ( 이 값을 이용해 난수화해서 해독할 수 없게한다 )
         *
         * @param { any } options - 유효기간등 옵션을 설정할 수 있다
         *                          ( expiresIn : '1h' => 1시간 유효 )
         */
        const token = jwt.sign( {
                email : loadedUser.email,
                userId : loadedUser._id.toString(),
            } ,
            'somesupersecretsecret' , {
                expiresIn : '1h'
            } );

        /** 토큰값과 사용자 id 를 반환 */
        res.status( 200 ).json( { token , userId : loadedUser._id.toString() } );
    }
    catch( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
}

exports.getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: user.status });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        user.status = newStatus;
        await user.save();
        res.status(200).json({ message: 'User updated.' });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
