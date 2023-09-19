const { validationResult } = require( 'express-validator' );
const bcrypt = require( 'bcryptjs' );
const User = require( '../models/user' );

/**
 * - 회원 가입 Controller
 * @param req
 * @param res
 * @param next
 */
exports.signup = ( req , res , next ) => {
    const errors = validationResult( req );
    /** route validation 에서 체크한 에러가 존재할 경우 */
    if ( !errors.isEmpty() ){
        const error = new Error( 'Validation failed.' );
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const { email , name , password } = req.body;

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
    bcrypt.hash( password , 12 )
        /** password 를 암호화하고 저장한 후, 응답 값 반환 */
        .then( hashedPw => {
            const user = new User( {
                email ,
                password : hashedPw,
                name
            } );

            return user.save();
        } )
        .then( result => {
            res.status( 201 ).json( { message : 'User created!' , userId : result._id } );
        } )
        .catch( err => {
            if ( !err.statusCode ){
                err.statusCode = 500;
            }
            next( err );
        } );
}