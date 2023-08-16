/**
 * - 인증관련 라우트
 */
const express = require( 'express' );
/**
 * - check 로 모든 req 뿐 아니라, body , cookie , param ,query 등
 *   들어오는 req 중에서 특정 기능들만도 확인할 수 있다
 */
const { check , body } = require( 'express-validator' );

const router = express.Router();
const authController = require( '../controllers/auth' );
const User = require( '../models/user' );

router.get( '/login' , authController.getLogin );

router.get('/signup', authController.getSignup );

router.post(
    '/login'  ,
    [
        body( 'email' )
            .isEmail()
            .withMessage( 'Please enter a valid email address.' )
            /** email 의 맨 앞을 소문자로 변경해주는 sanitizer */
            .normalizeEmail()
        ,
        body( 'password' , 'Please enter a password with only numbers and text and least 4 characters.' )
            .isLength( { min : 4 } )
            .isAlphanumeric()
            /** password 의 공백을 제거해주는 sanitizer */
            .trim()
        ,
    ],
    authController.postLogin
);

/**
 *
 * --> 파라미터 에 view 에서 전송하는 데이터 필드의 이름을 입력
 *
 * --> email 값 확인 , 유효성을 검사하려는 것을 알림
 *    ( 들어오는 req 의 email 필드 검사,
 *      body , query , header , cookie 에서 해당 필드 값( 첫 번째 파라미터 )을 찾음 )에
 *
 * --> check( 'email' ).isEmail() 미들웨어에서는 에러를 수집하여 다음 미들웨어의 req 에 담아 보낸다
 *
 * --> withMessage() 를 통하여, email 이 실패할 경우 어떤 메시지를 담을지 설정할 수 있다
 * */
router.post(
    '/signup',
    [
        check( 'email' )
            .isEmail()
            .withMessage( 'Please enter a valid email.' )
            /**
             * - 사용자지정 custom 에러 생성가능
             * --> 즉, email 뿐만 아니라, 특정 에러등도 커스텀해 추가할 수 있다
             *
             * - 즉, 사용자 검증자를 추가할 수 있다
             *
             * - custom validator 는 true , false ,error ,promise 객체를 반환할 수 있다
             */
            .custom( ( value , { req } ) => {

                return User.findOne( { email : value } )
                    .then( userDoc => {
                        /**
                         * - 해당 email 을 가진 사용자가 있다면,
                         *   해당 사용자를 생성하지 말아야 한다
                         */
                        if (userDoc) {
                            return Promise.reject( 'E-Mail exists already, please pick a different one.' );
                        }
                    } );
            } )
            .normalizeEmail()
        ,
        /**
         * - 들어온 요청의 body 의 password 필드는,
         *
         * - 반드시 5 문자열 이상( isLength )이어야하고,
         *   숫자와 일반문자( isAlphanumeric )들만 허용한다
         *
         * - 특정한 validation 마다 뒤에 withMessage 메서드를 추가하여,
         *   해당 validation 의 검증에 대한 메시지를 보낼 수도 있지만,
         *
         *   일괄적으로 2번째 파라미터에 기본 메시지를 생성할 수도 있다
         */
        body( 'password' , 'Please enter a password with only numbers and text and least 5 characters.' )
            .isLength( { min : 5 } )
            .isAlphanumeric()
            .trim(),
        /** 해당 password 가 동일한지 검증하는 메서드 */
        body( 'confirmPassword' )
            .trim()
            .custom( ( value , { req } ) => {
                if ( value !== req.body.password ){
                    throw new Error( 'Passwords have to match!' );
                }
                return true;
            } )
    ] ,
    authController.postSignup );

router.post( '/logout' , authController.postLogout );

router.get( '/reset' , authController.getReset );

router.post( '/reset' , authController.postReset );

/** DynamicRoute 를 이용하여 token 값 설정 */
router.get( '/reset/:token' , authController.getNewPassword );

router.post( '/new-password' , authController.postNewPassword );

module.exports = router;