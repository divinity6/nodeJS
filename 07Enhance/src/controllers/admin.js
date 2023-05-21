const Product = require( "../models/product" );

/**
 * - Admin Products Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {
    Product.fetchAll( ( products ) => {
        res.render( 'admin/products' , {
            prods : products ,
            pageTitle : 'Admin Products' ,
            path : '/admin/products' ,
        } );
    } );
}

/**
 * - 제품추가 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getAddProduct = ( req , res , next )=> {
    res.render( 'admin/add-product' , {
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

    const { title , imageUrl , description , price } = req.body;

    const product = new Product( title , imageUrl , description , price );

    console.log( "Res" , req.body );
    product.save();

    res.redirect( '/' );
}
