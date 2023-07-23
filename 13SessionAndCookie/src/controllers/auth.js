const User = require( '../models/user' );

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
    res.render( 'auth/login' , {
        pageTitle : 'Login' ,
        path : '/login' ,
        isAuthenticated : req.session.isLoggedIn,
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
    User.findById( '64b28d5af6522c01b9d0884d' )
        .then( user =>{
            /**
             * - 세션에 값 설정( 자동으로 cookie 에 설정된다 )
             * --> 기본 HttpOnly 속성이 부여된다
             *
             * --> 브라우저 cookie 에 sessionId 를 뜻하는 connect.sid 가 설정된다
             * --> 기본적으로 세션쿠키이므로 브라우저를 닫으면 만료된다
             *
             * --> 사용자, 즉 해당 브라우저 세션인스턴스를 식별한다
             *     즉, 해당 브라우저를 닫으면( 해당 브라우저와 연결이 종료되면 ) 죽는다
             * */
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save( ( err ) =>{
                console.log( '<<saveUserInfo Session success>>' , err );
                res.redirect( '/' );
            } );
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
