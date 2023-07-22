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
    const cookie = req.get( 'Cookie' );
    let isLoggedIn = false;
    if ( cookie ){
        console.log( 'cookie.trim().split( \'=\' )' , cookie.trim().split( '=' ) )
        isLoggedIn = cookie.trim().split( '=' )[ 1 ] === 'true';
    }
    res.render( 'auth/login' , {
        pageTitle : 'Login' ,
        path : '/login' ,
        isAuthenticated : isLoggedIn
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
    /**
     * - response header 에 설정
     *
     * --> Set-Cookie : cookie 에 값을 설정한다는 예약어
     * --> 데이터는 key=value 페어를 사용한다
     *
     * --> 다른값을 추가로 입력하고 싶을 경우에는 ;후 작성한다
     * --> Expires= , Max-Age= 등은 Http 에서 지원하는 값들이므로, 해당형식을 따라야한다
     *
     * --> Secure --> HTTPS 를 통해 페이지를 접근 및 제공할때만 cookie 가 설정된다
     * --> HttpOnly --> 클라이언트, 즉, JS 로 Cookie 에 접근할 수 없도록 설정
     */
    res.setHeader( 'Set-Cookie' , 'loggedIn=true; HttpOnly');
    res.redirect( '/' );

}
