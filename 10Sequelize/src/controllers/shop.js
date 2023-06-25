const Product = require( '../models/product' );

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
 *
 * --> 제품페이지 반환
 *
 * @param req
 * @param res
 * @param next
 */
exports.getCart = ( req , res , next ) => {

    req.user.getCart()
        .then( cart => {
            console.log( "Cart" , cart );
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
        .catch( err => console.log( '<<getCartFetchErr>> :' , err ) );

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
    let fetchedCart;
    let newQuantity = 1;

    /**
     * - 장바구니에 추가하고자 하는 제품이 존재하는지 확인 후,
     *   없으면 만들어주고, 있으면 증가시키면 된다
     */
    req.user.getCart()
        .then( cart => {
            fetchedCart = cart;
            /** cart 와 관계된 Product 들... */
            return cart.getProducts( { where : { id : prodId } } );
        } )
        .then( products => {
            const [ product ] = products;

            if ( product ){
                /**
                 * - 장바구니에 저장된 제품의 수량을 얻게된다
                 */
                const oldQuantity = product.cartItem.quantity;
                newQuantity += oldQuantity;

                return Promise.resolve( product );
            }

            /**
             * - 장바구니에 제품이 없을 경우, 해당 제품을 Product 에서 조회
             * */
            return Product.findByPk( prodId );
        } )
        /**
         * - 해당 제품을 저장
         *
         * - 업데이트할때, quantity 는 newQuantity 로 업데이트해서 저장
         */
        .then( product => {
            return fetchedCart.addProduct( product , { through : { quantity : newQuantity } } );
        } )
        .then( () => {
            res.redirect( '/cart' );
        } )
        .catch( err => console.log( '<<postCartProductsFetchErr>> :' , err ) );
}

exports.postCartDeleteProdcut = ( req , res , next ) => {
    const prodId = req.body.productId;

    req.user.getCart()
        /** 해당 cart 의 제품들중 id 가 prodId 인 제품찾기 */
        .then( cart => {
            return cart.getProducts( { where : { id : prodId } } )
        } )
        /** 해당 제품의 cartItem( Cart 와 Product 의 연결 테이블 )에서 제거 */
        .then( products => {
            const [ product ] = products;
            return product.cartItem.destroy();
        } )
        .then( () => {
            res.redirect( 'cart' );
        } )
        .catch( err => console.log( '<<postDeleteCartProductsFetchErr>> :' , err ) );
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

    res.render( 'shop/orders' , {
        pageTitle : 'Your Orders' ,
        path : '/orders' ,
    } );
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
    req.user.getCart()
        .then( cart => {
            return cart.getProducts();
        } )
        .then( products => {
            return req.user.createOrder()
                .then( order => {
                    /**
                     * - cartItem 들에 저장된 수량들을 order 의 orderItem 에 복사하여 전달
                     */
                    return order.addProduct( products.map( product => {
                        product.orderItem = { quantity : product.cartItem.quantity };
                        return product;
                    } ) );
                } )
                .catch( err => console.log( '<<postOrderCreateOrderErr>> :' , err ) );
        } )
        .then( result => {
            res.redirect( '/orders' );
        } )
        .catch( err => console.log( '<<postOrderFetchErr>> :' , err ) );
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