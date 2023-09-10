const express = require( 'express' );

const paymentController = require( '../controllers/payment' );
const isAuth = require( '../middleware/is-auth' );
const router = express.Router();

router.get( '/kakao-pay/success' , paymentController.getKakaoPaySuccess );

router.post( '/kakao-pay/ready' , isAuth , paymentController.postKakaoPayReady );

router.post( '/nice-pay/success' , paymentController.postNicePaySuccess );

module.exports = router;