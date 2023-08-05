/**
 * - 인증관련 라우트
 */
const express = require( 'express' );
const router = express.Router();
const authController = require( '../controllers/auth' );

router.get( '/login' , authController.getLogin );

router.get('/signup', authController.getSignup );

router.post( '/login' , authController.postLogin );

router.post('/signup', authController.postSignup );

router.post( '/logout' , authController.postLogout );

router.get( '/reset' , authController.getReset );

router.post( '/reset' , authController.postReset );

/** DynamicRoute 를 이용하여 token 값 설정 */
router.get( '/reset/:token' , authController.getNewPassword );

module.exports = router;