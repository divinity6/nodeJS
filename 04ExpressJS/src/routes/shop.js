/**
 * - 사용자가 보게될 내용
 */
const path = require( 'path' );

const express = require( 'express' );

const router = express.Router();

router.get( '/' , ( req , res , next )=> {
    res.sendFile( path.join( __dirname , '../' , 'views' , 'shop.html' ) );
} );

module.exports = router;