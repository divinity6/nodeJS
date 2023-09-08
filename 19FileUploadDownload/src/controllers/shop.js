const fs = require( 'fs' );
const path = require("path");
const PDFDocument = require( "pdfkit" );

const Product = require( '../models/product' );
const Order = require( '../models/order' );
const {or} = require("sequelize");

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
            console.log( '<< invoicePath >>' , invoicePath );
            /** pdfDoc 객체는 읽을 수 있는 스트림에 해당한다 */
            const pdfDoc = new PDFDocument();

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
             * - fs 에서 읽을 수 있는 파일스트림으로 만들어 pdfDoc 의 pipe 메서드에 전달한다
             *
             * --> path 를 설정해, 해당 파일을 클라이언트 뿐만 아니라, 서버에도 저장되도록 한다
             */
            pdfDoc.pipe( fs.createWriteStream( invoicePath ) );
            /**
             * - 결괏값을 응답에도 pipe 한다
             *
             * --> res 는 쓰기가능한 스트림이고, pdfDoc 은 읽기가능하기 때문에 진행할 수 있다
             */
            pdfDoc.pipe( res );
            /** PDF 셋 설정을 할 수 있다 */
            pdfDoc.registerFont( 'NotoSansCKJ', path.join( 'public' , 'font' , 'NotoSansKR-Medium.ttf' ) );
            pdfDoc.font( 'NotoSansCKJ' );
            pdfDoc.fontSize( 26 ).text( 'Invoice' , {
                underline : true,
            } );   // text 한줄 추가
            pdfDoc.text( '---------------------------' );
            let totalPrice = 0;
            order.products.forEach( prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize( 14 )
                    .text(
                    `${ prod.product.title } - ${ prod.quantity } x $${ prod.product.price }` );
            } );
            pdfDoc.text( '---' );
            pdfDoc.fontSize( 20 ).text( `Total Price: $${ totalPrice }` );


            pdfDoc.end();   // pdf 의 쓰기가 완료됨을 알림
        } )
        .catch( err => next( err ) );
}