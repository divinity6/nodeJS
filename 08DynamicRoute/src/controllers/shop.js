const Product = require( '../models/product' );

/**
 * - 제품 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    Product.fetchAll( ( products ) => {
        res.render( 'shop/product-list' , {
            prods : products ,
            pageTitle : 'All Products' ,
            path : '/products' ,
        } );
    } );

}

/**
 * - index Controller
 * @param req
 * @param res
 * @param next
 */
exports.getIndex = ( req , res , next ) => {

    Product.fetchAll( ( products ) => {
        res.render( 'shop/index' , {
            prods : products ,
            pageTitle : 'Shop' ,
            path : '/' ,
        } );
    } );
}

/**
 * - Cart Controller
 * @param req
 * @param res
 * @param next
 */
exports.getCart = ( req , res , next ) => {

    res.render( 'shop/cart' , {
        pageTitle : 'Your Cart' ,
        path : '/cart' ,
    } );
}

/**
 * - Cart Controller
 * @param req
 * @param res
 * @param next
 */
exports.getOrders = ( req , res , next ) => {

    res.render( 'shop/orders' , {
        pageTitle : 'Your Orders' ,
        path : '/orders' ,
    } );
}

/**
 * - Checkout Controller
 * @param req
 * @param res
 * @param next
 */
exports.getCheckout = ( req , res , next ) => {

    res.render( 'shop/checkout' , {
        pageTitle : 'Checkout' ,
        path : '/checkout' ,
    } );
}