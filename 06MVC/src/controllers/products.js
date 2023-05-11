const adminData = require("../routes/admin");
const products = [];

/**
 * - 제품추가 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getAddProduct = ( req , res , next )=> {
    // res.sendFile( path.join( rootDir , 'views' , 'add-product.html' ) );
    res.render( 'add-product' , {
        pageTitle : 'Add Product' ,
        path : "/admin/add-product",
        active : true,
        activeAddProduct : true,
        formsCSS : true,
        productCSS : true
    } )
}

/**
 * - 제품추가 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postAddProduct = ( req , res , next ) => {
    products.push( { title : req.body.title } )
    res.redirect( '/' );
}

/**
 * - 제품 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {
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
}