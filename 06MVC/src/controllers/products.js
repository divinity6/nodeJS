const Product = require( '../models/product' );

/**
 * - 제품추가 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getAddProduct = ( req , res , next )=> {
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
    const product = new Product( req.body.title );
    product.save();

    res.redirect( '/' );
}

/**
 * - 제품 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    Product.fetchAll( ( products ) => {
        res.render( 'shop' , {
            prods : products ,
            pageTitle : 'Shop' ,
            path : '/' ,
            hasProducts : 0 < products.length,
            activeShop : true,
            productCSS : true,
        } );
    } );

}