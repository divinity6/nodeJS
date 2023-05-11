/**
 * - 사용자가 보게될 내용
 */
const path = require( 'path' );

const express = require( 'express' );

const productsController = require( '../controllers/products' );

const router = express.Router();

router.get( '/' , productsController.getProducts );

module.exports = router;