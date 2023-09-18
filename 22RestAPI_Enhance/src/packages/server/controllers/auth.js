const User = require( '../models/user' );
const { validationResult } = require( 'express-validator' );

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
}