/**
 * - 사용자가 보게될 내용 관련 라우팅 파일
 *
 * --> 실제 페이지 패스의 접근경로
 */
const path = require( 'path' );

const express = require( 'express' );

const shopController = require( '../controllers/shop' );

/** Routes */
const router = express.Router();

router.get( '/' , shopController.getIndex );

router.get( '/products' , shopController.getProducts );

/** DynamicRoute */
router.get( '/products/:productId' , shopController.getProduct );

router.get( '/cart' , shopController.getCart );

router.post( '/cart' , shopController.postCart );
//
// router.post( '/cart-delete-item' , shopController.postCartDeleteProduct );
//
// router.post( '/create-order' , shopController.postOrder );
//
// router.get( '/orders' , shopController.getOrders );

/** checkout 기능 잠시 주석처리 */
// router.get( '/checkout' , shopController.getCheckout );

module.exports = router;