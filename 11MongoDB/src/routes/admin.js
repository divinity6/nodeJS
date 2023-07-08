/**
 * - 매장관리자의 제품생성 처리 관련 라우팅 파일
 *
 * --> 실제 페이지 패스의 접근경로
 */
const express = require( 'express' );

const adminController = require( '../controllers/admin' );

const path = require("path");

const router = express.Router();



// /admin/add-product => GET
router.get( '/add-product' , adminController.getAddProduct );

// /admin/products => GET
router.get( '/products' , adminController.getProducts );

// /admin/add-product => POST
router.post( '/add-product' , adminController.postAddProduct );

router.get( '/edit-product/:productId' , adminController.getEditProduct );

router.post( '/edit-product' , adminController.postEditProduct );
//
router.post( '/delete-product' , adminController.postDeleteProduct );

module.exports = router;