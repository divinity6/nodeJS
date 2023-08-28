const fs = require( 'fs' );
const path = require("path");

const Product = require( '../models/product' );
const Order = require( '../models/order' );

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
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
        } );
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
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
        } );
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
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
        } );
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
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
        } );

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
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
        } );
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

    req.user
        .removeFromCart( prodId )
        .then( () => {
            res.redirect( 'cart' );
        } )
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
        } );
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

    /** 해당 사용자에 속한 모든 주문을 가져온다 */
    Order.find( { 'user.userId' : req.user._id } )
        .then( orders => {
            res.render( 'shop/orders' , {
                pageTitle : 'Your Orders' ,
                path : '/orders' ,
                orders : orders,
            } );
        } )
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
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
    /** productId 에 해당하는 필드값들을 채워오는 명령 */
    req.user
        .populate( 'cart.items.productId' )
        .then( user => {
            console.log( 'userId' , user.cart.items );
            /** 가져온 제품들중 필요한 값들만 추출 */
            const products = user.cart.items.map( item => {
                return {
                    quantity : item.quantity,
                    /**
                     * - item.productId 이렇게만하면 mongoose 가 자동으로 해당 데이터중 id 를 찾아할당하므로,
                     *   _doc 를 이용하여 해당 데이터에 접근할 수 있다
                     * */
                    product : {...item.productId._doc },
                }
            } );
            const order = new Order( {
                user : {
                    email : req.user.email,
                    /** mongoose 가 자체적으로 userId 를 선택할 것이다 */
                    userId : req.user
                },
                products
            } );
            return order.save();
        } )
        .then( result => {
            return req.user.clearCart();
        } )
        .then( () => {
            res.redirect( '/orders' );
        } )
        .catch( err => {
            const error = new Error( err );
            error.httpStatusCode = 500;
            return next( error );
        } );
}

/**
 * - Invoice Controller
 *
 * --> 인증 파일제공 컨트롤러
 *
 * @param req
 * @param res
 * @param next
 */
exports.getInvoice = ( req , res , next ) => {
    const orderId = req.params.orderId;

    Order.findById( orderId )
        .then( order => {
            if ( !order ){
                return next( new Error( 'No order found.' ) );
            }
            if ( order.user.userId.toString() !== req.user._id.toString() ) {
                return next( new Error( 'Unauthorized.' ) );
            }

            const invoiceName = `invoice-${ orderId }.pdf`;
            /** 모든 OS 에서 동작하도록 path 모듈을 이용하여, 해당 파일 경로를 찾는다 */
            const invoicePath = path.join( 'data' , 'invoices' , invoiceName );

            /**
             * - 스트리밍 방식으로 파일을 읽는다.
             *
             * - 즉, 청크( Chunk )단위로 파일을 읽는다
             */
            const file = fs.createReadStream( invoicePath );
            /** 브라우저에 pdf 라는 정보를 제공하면 브라우저 내부에서 해당 파일을 inline 으로 연다 */
            res.setHeader( 'Content-Type' , 'application/pdf' );
            /**
             * - 클라이언트에게 콘텐츠가 어떻게 제공되는지 정의할 수 있다
             *
             * inline : 브라우저에서 열림
             * attachment : 파일을 다운로드함
             * */
            res.setHeader( 'Content-Disposition' , `inline; filename="${ invoiceName }"` );

            /**
             * - pipe 메서드를 이용해 읽어들인 데이터를 res 로 전달
             *
             * --> response 는 쓰기 가능한 스트림이기 때문에, 읽기 가능한 스트림을 사용해,
             *     출력값을 쓰기 스트림으로 전달한다
             *
             *  - 응답이 데이터를 가지고 브라우저로 스트리밍된다
             */
            file.pipe( res );
        } )
        .catch( err => next( err ) );
}