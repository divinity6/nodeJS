/**
 * - 매장관리자의 제품생성 처리 관련 라우팅 파일
 *
 * --> 실제 페이지 패스의 접근경로
 */
const express = require( 'express' );
const path = require("path");

const adminController = require( '../controllers/admin' );
const isAuth = require( '../middleware/is-auth' );

const router = express.Router();

// /admin/add-product => GET
router.get( '/add-product' , isAuth , adminController.getAddProduct );

// /admin/products => GET
router.get( '/products' , isAuth , adminController.getProducts );

// /admin/add-product => POST
router.post( '/add-product' , isAuth , adminController.postAddProduct );

router.get( '/edit-product/:productId' , isAuth , adminController.getEditProduct );

router.post( '/edit-product' , isAuth , adminController.postEditProduct );

router.post( '/delete-product' , isAuth , adminController.postDeleteProduct );

module.exports = router;