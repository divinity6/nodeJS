const jwt = require( 'jsonwebtoken' );

/**
 * - JSON Web Token 인증 미들웨어
 * @param req
 * @param res
 * @param next
 */
module.exports = ( req , res , next ) => {
    const authHeader = req.get( 'Authorization' );

    /** 인증헤더를 부착하지 않았을 경우 */
    if ( !authHeader ){
        const error = new Error( 'Not authenticated.' );
        error.statusCode = 401;
        throw error;
    }

    /** Authorization 헤더 반환 Bearer 부분을 잘라서 사용 */
    const [ _ , token ] = authHeader.split( ' ' );
    let decodedToken;
    try {
        /**
         * - verify() 메서드는 토큰을 해석할뿐만 아니라, 체크하는 과정도 거친다
         *
         * - decoded 메서드도 존재하지만, 해독만하지, 유효한지는 체크하지 않기 때문에
         *   반드시 verify 메서드를 사용한다
         *
         * --> verify 메서드는 토큰과 비공개 인증키를 함께 넣어줘야한다
         */
        decodedToken = jwt.verify( token , 'somesupersecretsecret' );
    }
    catch ( err ){
        /** error 핸들러에서 처리 */
        err.statusCode = 500;
        throw err;
    }

    /** 해독은 잘되었지만, 토큰이 유효하지 않을 경우 */
    if ( !decodedToken ){
        const error = new Error( 'Not authenticated.' );
        error.statusCode = 401;
        throw error;
    }

    /** 인증이 되었다면 해당 토큰의 userId 를 요청에 부착하여 사용 */
    req.userId = decodedToken.userId;
    console.log( '<< JWT Auth UserId>>' , req.userId );
    next();
}