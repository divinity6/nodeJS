/**
 * - 사용자가 보게될 내용
 */
const path = require( 'path' );

const express = require( 'express' );

const rootDir = require( '../util/path.js' );

const adminData = require( './admin.js' );

const router = express.Router();

router.get( '/' , ( req , res , next )=> {
    console.log( "shop.js" , adminData.products )
    // res.sendFile( path.join( rootDir , 'views' , 'shop.html' ) );
    const products = adminData.products;
    /**
     * - 모든 view 파일이 views 폴더에 있다고, app.set 으로 정의했기 때문에
     *   경로를 생략해도 되고,
     *
     * - pug 를 view engine 으로 설정했기 때문에 파일이름도 생략해도 된다
     *
     * - 모든 .pug 파일을 탐색할 것이다
     */
    res.render( 'shop' , {
        prods : products ,
        pageTitle : 'Shop' ,
        path : '/' ,
        hasProducts : 0 < products.length,
        activeShop : true,
        productCSS : true,
    } )
} );

module.exports = router;