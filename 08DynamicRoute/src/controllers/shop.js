const Product = require( '../models/product' );

/**
 * - 제품 리스트 페이지 반환 Controller
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
 * - 제품 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProduct = ( req , res , next ) =>{
    const prodId = req.params.productId;

    Product.findById( prodId , product => {
        res.render( 'shop/product-detail' , {
            pageTitle : product.title ,
            path : '/products',
            prod : product,
        } )
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
            pageTitle : 'Shop' ,
            path : '/' ,
            prods : products ,
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