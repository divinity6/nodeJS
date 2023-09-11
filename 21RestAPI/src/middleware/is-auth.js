module.exports = ( req , res , next ) => {
    /** 세션에 사용자가 로그인 했는지 정보 체크 */
    if ( !req.session.isLoggedIn ){
        /**
         * - 사용자가 로그인하지 않았으면 login 페이지로 리다이렉트 시킨다
         */
        return res.redirect( '/login' );
    }
    next();
}