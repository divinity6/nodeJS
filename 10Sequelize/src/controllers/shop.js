const Product = require( '../models/product' );
const Cart = require( '../models/cart' );

/**
 * - 제품 리스트 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    /**
     *  - 전체 제품 조회
     *
     *  --> where 문을 이용해 원하는 조건을 필터링할 수 있다
     */
    Product.findAll()
        .then( products => {
            res.render( 'shop/product-list' , {
                prods : products ,
                pageTitle : 'All Products' ,
                path : '/products' ,
            } );
        } )
        .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );
}

/**
 * - 제품 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProduct = ( req , res , next ) =>{
    const prodId = req.params.productId;

    /**
     * - id 를 이용한 단건 제품 조회
     */
    Product.findByPk( prodId )
        .then( ( product ) => {
            res.render( 'shop/product-detail' , {
                pageTitle : product.title ,
                path : '/products',
                product :product,
            } )
        } )
        .catch( err => console.log( '<<findDataFetchErr>> :' , err ) );
}

/**
 * - index Controller
 * @param req
 * @param res
 * @param next
 */
exports.getIndex = ( req , res , next ) => {

    Product.findAll()
        .then( products => {
            console.log( "<<products>>" , products[ 0 ] )
            res.render( 'shop/index' , {
                pageTitle : 'Shop' ,
                path : '/' ,
                prods : products ,
            } );
        } )
        .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );
}

/**
 * - Cart Controller
 * @param req
 * @param res
 * @param next
 */
exports.getCart = ( req , res , next ) => {

    req.user.getCart()
        .then( cart => {
            return cart.getProducts()
                .then( products => {
                    res.render( 'shop/cart' , {
                        pageTitle : 'Your Cart' ,
                        path : '/cart' ,
                        products : products,
                    } );
                } )
                .catch( err => console.log( '<<getCartProductsFetchErr>> :' , err ) );
        } )
        .catch( err => console.log( '<<getCartFetchErr>> :' , err ) )

    // Cart.getCart( cart => {
    //
    //     Product.findAll()
    //         .then( products => {
    //
    //             const cartProducts = [];
    //
    //             for ( const product of products ){
    //                 const cartProductData = cart.products.find( prod => prod.id === product.id );
    //                 if ( cartProductData ){
    //                     cartProducts.push( { productData : product , qty : cartProductData.qty } );
    //                 }
    //             }
    //
    //             res.render( 'shop/cart' , {
    //                 pageTitle : 'Your Cart' ,
    //                 path : '/cart' ,
    //                 products : cartProducts,
    //             } );
    //         } )
    //         .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );
    // } );

}

/**
 * - Cart Controller
 * @param req
 * @param res
 * @param next
 */
exports.postCart = ( req , res , next ) => {
    const prodId = req.body.productId;

    console.log( "prodId" , prodId );

    Product.findById( prodId , ( product ) => {
         Cart.addProduct( prodId , product.price );
    } );

    res.redirect( '/cart' );
}

exports.postCartDeleteProdcut = ( req , res , next ) => {
    const prodId = req.body.productId;

    Product.findById( prodId , ( product ) => {
        Cart.deleteProduct( prodId , product.price );

        res.redirect( 'cart' );
    } );

}

/**
 * - Post Cart Controller
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