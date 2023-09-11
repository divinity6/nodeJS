const axios = require("axios");
const privateKeys = require("../util/privateKeys");

/** kakaoPay 결제 필수정보 생성기 */
const createKakaoPayInfo = () => {
    return {
        cid : 'TC0ONETIME',
        tid : '',
        partner_order_id : 'partner_order_id',
        partner_user_id : 'partner_user_id',
    }
}

/**
 * - KakaoPay 준비단계 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postKakaoPayReady = ( req , res , next ) => {
    const paymentInfo = createKakaoPayInfo();

    const param = {
        cid : paymentInfo.cid,
        partner_order_id : paymentInfo.partner_order_id, // 파트너 아이디
        partner_user_id : paymentInfo.partner_user_id,   // 파트너 사용자 아이디
        item_name : req.query.name,
        quantity : Number( req.query.quantity ),
        total_amount : Number( req.query.amount ),
        tax_free_amount : 0,
        approval_url : `${ req.protocol }://${ req.get( 'host' ) }/payment/kakao-pay/success`,
        cancel_url : req.query.cancelURL,
        fail_url : req.query.cancelURL,
    }

    const headers = {
        'Authorization':`KakaoAK ${ privateKeys.KAKAO_AK }`,
        'Content-type':`application/x-www-form-urlencoded;charset=utf-8`
    }

    axios.post( 'https://kapi.kakao.com/v1/payment/ready' , param , { headers } )
        .then( kakaoRes => {
            paymentInfo.tid = kakaoRes.data.tid;
            req.session.paymentInfo = paymentInfo;
            return res.status( 200 ).json( { message : 'Success!' , redirectUrl : kakaoRes.data.next_redirect_pc_url } );
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
            return next( err );
        } );
}

/**
 * - KakaoPay 결제 성공 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getKakaoPaySuccess = ( req , res , next ) => {
    const param = {
        cid : req.session.paymentInfo.cid,
        tid : req.session.paymentInfo.tid,
        partner_order_id : req.session.paymentInfo.partner_order_id,
        partner_user_id : req.session.paymentInfo.partner_user_id,
        pg_token : req.query.pg_token,
    }

    const headers = {
        'Authorization':`KakaoAK ${ privateKeys.KAKAO_AK }`,
        'Content-type':`application/x-www-form-urlencoded;charset=utf-8`
    }

    axios.post( 'https://kapi.kakao.com/v1/payment/approve' , param , { headers } )
        .then( kakaoRes => {
            return  res.redirect( `${ req.protocol }://${ req.get( 'host' ) }/checkout/success` );
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
            return next( err );
        } );
}

/**
 * - NicePay 결제 성공 Controller
 *
 * --> 나이스페이는 결제준비를 클라이언트에서 실행합니다
 *
 * @param req
 * @param res
 * @param next
 */
exports.postNicePaySuccess = ( req , res , next ) => {
    const nicePay = { ...req.body };

    const param = {
        amount : nicePay.amount
    };

    const apiKey = Buffer.from( `${ privateKeys.NICE_PAY_CLIENT_KEY }:${ privateKeys.NICE_PAY_SECRET_KEY }`, 'utf8' ).toString( 'base64' );
    const headers = {
        'Authorization':`Basic ${ apiKey }`,
        'Content-type':`application/json`
    };

    // 실제 운영 결제시 api.nicepay.co.kr/v1/payments/${ tid }
    axios.post( `https://sandbox-api.nicepay.co.kr/v1/payments/${ nicePay.tid }` ,  param , { headers } )
        .then( nicePayRes => {
            console.log( '<< nicePay Success Res >>' , nicePayRes.data );
            return res.redirect( `${ req.protocol }://${ req.get( 'host' ) }/checkout/success` );
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
            return next( err );
        } );
}