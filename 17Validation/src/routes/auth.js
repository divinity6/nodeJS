/**
 * - 인증관련 라우트
 */
const express = require( 'express' );
const { check } = require( 'express-validator' );

const router = express.Router();
const authController = require( '../controllers/auth' );

router.get( '/login' , authController.getLogin );

router.get('/signup', authController.getSignup );

router.post( '/login' , authController.postLogin );

/**
 *
 * --> 파라미터 에 view 에서 전송하는 데이터 필드의 이름을 입력
 *
 * --> email 값 확인 , 유효성을 검사하려는 것을 알림
 *    ( 들어오는 req 의 email 필드 검사,
 *      body , query , header , cookie 에서 해당 필드 값( 첫 번째 파라미터 )을 찾음 )에
 *
 * --> check( 'email' ).isEmail() 미들웨어에서는 에러를 수집하여 다음 미들웨어의 req 에 담아 보낸다
 * */
router.post('/signup', check( 'email' ).isEmail() , authController.postSignup );

router.post( '/logout' , authController.postLogout );

router.get( '/reset' , authController.getReset );

router.post( '/reset' , authController.postReset );

/** DynamicRoute 를 이용하여 token 값 설정 */
router.get( '/reset/:token' , authController.getNewPassword );

router.post( '/new-password' , authController.postNewPassword );

module.exports = router;