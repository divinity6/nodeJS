const bcrypt = require( 'bcryptjs' );
const validator = require( 'validator' );

const User = require( '../models/user' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
    /**
     * - Schema 에 정의했던 arguments 데이터들이 첫 번째 argument 에 들어온다
     *   ( 다수의 arguments 들을 입력할 수 있기 때문에, 첫번째 파라미터에 객체형태로 들어온다 )
     * */
    createUser : async function( { userInput } , req ){
        const existingUser = await User.findOne( { email : userInput.email } );

        const errors = [];
        /** email 체크 */
        if ( !validator.isEmail( userInput.email ) ){
           errors.push( { message : 'E-Mail is invalid.' } );
        }

        /** password 체크 */
        if (
            validator.isEmpty( userInput.password ) ||
            !validator.isLength( userInput.password , { min : 5 } )
        ){
            errors.push( { message : 'Password too short!' } );
        }

        if ( 0 < errors.length ){
            const error = new Error( 'Invalid input.' );
            /** 에러 객체의 data 필드에 발생한 error 들 추가 */
            error.data = errors;
            error.code = 422;

            throw error;
        }

        /** 사용자가 존재할 경우 에러 생성 */
        if ( existingUser ){
            const error = new Error( 'User exists already!' );
            throw error;
        }

        /** password 를 암호화하고 저장한 후, 응답 값 반환 */
        const hashedPw = await bcrypt.hash( userInput.password , 12 );
        const user = new User( {
            email : userInput.email,
            name : userInput.name,
            password : hashedPw
        } );

        /** DB 에 사용자 저장 */
        const createdUser = await user.save();

        /**
         * - Schema 에 정의된 User 객체와 같은 type 을 반환하도록 한다
         *
         * - _doc 를 사용하면, Mongoose 가 추가한 메타데이터를 제외한 사용자가 입력한 데이터들만 반환한다
         */
        return {
            ...createdUser._doc,
            _id : createdUser._id.toString(),
        }
    }
};