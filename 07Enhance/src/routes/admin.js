/**
 * - 매장관리자의 제품생성 처리 관련 라우팅 파일
 */
const express = require( 'express' );

const productController = require( '../controllers/products' );

const path = require("path");

const router = express.Router();



// /admin/add-product => GET
router.get( '/add-product' , productController.getAddProduct );

// /admin/add-product => POST
router.post( '/add-product' , productController.postAddProduct );

module.exports = router;