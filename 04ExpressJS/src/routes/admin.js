/**
 * - 매장관리자의 제품생성 처리 관련 라우팅 파일
 */
const express = require( 'express' );
const path = require("path");

const rootDir = require( "../util/path");

const router = express.Router();



// /admin/add-product => GET
router.get( '/add-product' , ( req , res , next )=> {
    res.sendFile( path.join( rootDir , 'views' , 'add-product.html' ) );
} );

// /admin/add-product => POST
router.post( '/add-product' , ( req , res , next ) => {
    console.log( 'req.body' ,  req.body );
    res.redirect( '/' );
} );

module.exports = router;