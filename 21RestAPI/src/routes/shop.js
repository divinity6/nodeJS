/**
 * - 사용자가 보게될 내용 관련 라우팅 파일
 *
 * --> 실제 페이지 패스의 접근경로
 */

const express = require( 'express' );

const shopController = require( '../controllers/shop' );
const isAuth = require( '../middleware/is-auth' );

/** Routes */
const router = express.Router();

router.get( '/' , shopController.getIndex );

router.get( '/products' , shopController.getProducts );

/** DynamicRoute */
router.get( '/products/:productId' , shopController.getProduct );

router.get( '/cart' , isAuth , shopController.getCart );

router.post( '/cart' , isAuth , shopController.postCart );

router.post( '/cart-delete-item' , isAuth , shopController.postCartDeleteProduct );

router.get( '/checkout' , isAuth , shopController.getCheckout );

router.get( '/checkout/success' , shopController.getCheckoutSuccess );

/** 실패하는 경우 이전 페이지로 리다이렉트 */
router.get( '/checkout/cancel' , shopController.getCheckout );

router.get( '/orders' , isAuth , shopController.getOrders );

router.get( '/orders/:orderId' , isAuth , shopController.getInvoice );

module.exports = router;