const express = require( 'express' );
const { body } = require( 'express-validator' );

const User = require( '../models/user' );

const router = express.Router();

const authController = require( '../controllers/auth' );

/** 회원가입시 새로운 데이터를 입력하거나 덮어씌우기 때문에 PUT 을 사용한다 */
// GET /auth/signup
router.put( '/signup' , [
    /** auth validation logic */
    body( 'email' )
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
            /** email 과 일치하는 사용자를 찾는다 */
            return User.findOne( { email : value } )
                .then( userDoc => {
                    /**
                     * - 해당 email 을 가진 사용자가 있다면,
                     *   해당 사용자를 생성하지 말아야 한다
                     */
                    if (userDoc) {
                        return Promise.reject( 'E-Mail exists already exists!' );
                    }
                } );
        } )
        .normalizeEmail(),

    /**
     * - 들어온 요청의 body 의 password 필드는,
     *
     * - 반드시 5 문자열 이상( isLength )이어야한다
     */
    body( 'password' ).trim().isLength( { min : 5 } ),
    /** 이름이 비어있지 않은지 체크 */
    body( 'name' ).trim().not().isEmpty(),
] , authController.signup );

module.exports = router;