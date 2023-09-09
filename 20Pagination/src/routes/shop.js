const axios = require( 'axios' );

/**
 * - 사용자가 보게될 내용 관련 라우팅 파일
 *
 * --> 실제 페이지 패스의 접근경로
 */
const path = require( 'path' );

const express = require( 'express' );

const shopController = require( '../controllers/shop' );
const isAuth = require( '../middleware/is-auth' );
const privateKeys = require( '../util/privateKeys' );

/** Routes */
const router = express.Router();

router.get( '/' , shopController.getIndex );

router.get( '/products' , shopController.getProducts );

/** DynamicRoute */
router.get( '/products/:productId' , shopController.getProduct );

router.get( '/cart' , isAuth , shopController.getCart );

router.post( '/cart' , isAuth , shopController.postCart );

router.post( '/cart-delete-item' , isAuth , shopController.postCartDeleteProduct );

router.get( '/checkout' , isAuth , shopController.getCheckout );

router.post( '/create-order' , isAuth , shopController.postOrder );

router.get( '/orders' , isAuth , shopController.getOrders );

router.get( '/orders/:orderId' , isAuth , shopController.getInvoice );

/** ===== 결제 테스트 코드 ===== */
const saveInfo = {
    cid : 'TC0ONETIME',
    tid : '',
    partner_order_id : 'partner_order_id',
    partner_user_id : 'partner_user_id',
    pg_token : '',
}

router.get( '/payment/success' , ( req , res , next ) => {
    saveInfo.pg_token = req.query.pg_token;

    const param = {
        cid : saveInfo.cid,
        tid : saveInfo.tid,
        partner_order_id : saveInfo.partner_order_id,
        partner_user_id : saveInfo.partner_user_id,
        pg_token : saveInfo.pg_token,
    }

    const headers = {
        'Authorization':`KakaoAK ${ privateKeys.kakaoAK }`,
        'Content-type':`application/x-www-form-urlencoded;charset=utf-8`
    }

    axios.post( 'https://kapi.kakao.com/v1/payment/approve' , param , { headers } )
        .then( kakaoRes => {
            console.log( '<< kakaoRes >>' , kakaoRes.data );
            return  res.redirect( '/' );
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
            return next( err );
        } );
} );

router.get( '/payment/cancel' , ( req , res , next ) => {
    console.log( '<< /payment/cancel >>' , req.query );
    return res.redirect( '/' );
} );

router.get( '/payment/fail' , ( req , res , next ) => {
    console.log( '<< /payment/fail >>' );
    return res.redirect( '/' );
} );

/** test 입니당 */
router.post( '/payment' , ( req , res , next ) => {
    const param = {
        cid : saveInfo.cid,
        partner_order_id : saveInfo.partner_order_id,
        partner_user_id : saveInfo.partner_user_id,
        item_name : '카카오테스트아이템',
        quantity : 2,
        total_amount : 5000,
        tax_free_amount : 0,
        approval_url : 'http://localhost:3000/payment/success',
        cancel_url : 'http://localhost:3000/payment/cancel',
        fail_url : 'http://localhost:3000/payment/fail',
    }

    const headers = {
        'Authorization':`KakaoAK ${ privateKeys.kakaoAK }`,
        'Content-type':`application/x-www-form-urlencoded;charset=utf-8`
    }

    axios.post( 'https://kapi.kakao.com/v1/payment/ready' , param , { headers } )
        .then( kakaoRes => {
            saveInfo.tid = kakaoRes.data.tid;
            return res.status( 200 ).json( { message : 'Success!' , kakaoData : kakaoRes.data } );
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
            return next( err );
        } );
} )

/** checkout 기능 잠시 주석처리 */
// router.get( '/checkout' , shopController.getCheckout );

module.exports = router;