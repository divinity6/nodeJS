const Product = require( '../models/product' );

/**
 * - 제품 리스트 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    /**
     *  - find 로 모든 제품을 가져올 수 있다
     */
    Product.find()
        .then( products => {
            res.render( 'shop/product-list' , {
                prods : products ,
                pageTitle : 'All Products' ,
                path : '/products' ,
            } );
        } )
        .catch( err => console.log( '<<getProductsFetchErr>> :' , err ) );
}

/**
 * - 제품 페이지 반환 Controller
 *
 * --> 제품 페이지 반환
 *
 * @param req
 * @param res
 * @param next
 */
exports.getProduct = ( req , res , next ) =>{
    const prodId = req.params.productId;

    /**
     * - id 를 이용한 단건 제품 조회
     *
     * --> 파라미터로 string 을 전달하면 Mongoose 에서 ObjectId 로 변환해준다
     */
    Product.findById( prodId )
        .then( ( product ) => {
            res.render( 'shop/product-detail' , {
                pageTitle : product.title ,
                path : '/products',
                product :product,
            } )
        } )
        .catch( err => console.log( '<<getProductFetchErr>> :' , err ) );
}

/**
 * - index Controller
 * @param req
 * @param res
 * @param next
 */
exports.getIndex = ( req , res , next ) => {

    Product.find()
        .then( products => {
            res.render( 'shop/index' , {
                pageTitle : 'Shop' ,
                path : '/' ,
                prods : products ,
            } );
        } )
        .catch( err => console.log( '<<getIndexFetchErr>> :' , err ) );
}

/**
 * - Cart Controller
 *
 * --> 제품페이지 반환
 *
 * @param req
 * @param res
 * @param next
 */
exports.getCart = ( req , res , next ) => {
    /** productId 에 해당하는 필드값들을 채워오는 명령 */
    req.user
        .populate( 'cart.items.productId' )
        .then( user => {
            const products = user.cart.items;
            res.render( 'shop/cart' , {
                pageTitle : 'Your Cart' ,
                path : '/cart' ,
                products : products,
            } );
        } )
        .catch( err => console.log( '<<getCartProductsFetchErr>> :' , err ) );

}

/**
 * - Cart Controller
 *
 * --> Cart 에 해당 제품추가
 *
 * @param req
 * @param res
 * @param next
 */
exports.postCart = ( req , res , next ) => {
    const prodId = req.body.productId;

    Product.findById( prodId )
        .then( product => {
            return req.user.addToCart( product )
        } )
        .then( result => {
            console.log( '<<PostCartFetch>>' , result );
            res.redirect( '/cart' );
        } )
        .catch( err => console.log( '<<postCartFetchErr>> :' , err ) );
}

/**
 * - Cart Delete Controller
 *
 * --> Cart 에 해당 제품제거
 *
 * @param req
 * @param res
 * @param next
 */
exports.postCartDeleteProduct = ( req , res , next ) => {
    const prodId = req.body.productId;

    req.user.deleteItemFromCart( prodId )
        .then( () => {
            res.redirect( 'cart' );
        } )
        .catch( err => console.log( '<<postDeleteCartProductFetchErr>> :' , err ) );
}



/**
 * - get Orders Controller
 *
 * --> 주문 정보 페이지 반환
 *
 * @param req
 * @param res
 * @param next
 */
exports.getOrders = ( req , res , next ) => {
    /**
     * - 사용자의 주문의 제품을 모두 가져옴
     *
     * --> app.js 의 관계설정을 Order.belongsToMany( Product , { through : OrderItem } );
     *     로 했기 때문에 product 가 아닌 products 로 include 를 설정해야한다
     * */
    req.user.getOrders()
        .then( orders => {
            res.render( 'shop/orders' , {
                pageTitle : 'Your Orders' ,
                path : '/orders' ,
                orders : orders
            } );
        } )
        .catch( err => console.log( '<<getOrdersFetchErr>> :' , err ) );


}

/**
 * - post Orders Controller
 *
 * --> 카트에 있는 모든 제품을 orders 로 이동
 *
 * @param req
 * @param res
 * @param next
 */
exports.postOrder = ( req , res , next ) => {
    req.user.addOrder()
        .then( () => {
            res.redirect( '/orders' );
        } )
        .catch( err => console.log( '<<postOrderFetchErr>> :' , err ) );
}

/**
 * - Checkout Controller
 *
 * --> 사용하지 않아 잠시 주석처리
 * @param req
 * @param res
 * @param next
 */
// exports.getCheckout = ( req , res , next ) => {
//
//     res.render( 'shop/checkout' , {
//         pageTitle : 'Checkout' ,
//         path : '/checkout' ,
//     } );
// }