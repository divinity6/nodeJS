const kakaoPayBtn = document.querySelector( '#order-kakaoPay' );
const creditCardBtn = document.querySelector( '#order-creditCard' );

/**
 * - 카카오페이 결제
 */
kakaoPayBtn.addEventListener( 'click' , ( e ) => {
    const reqParam = Object.keys( paymentStore ).reduce( ( ( acc , key ) => {
        if ( 'lineItems' !== key ){
            acc[ key ] = paymentStore[ key ];
        };
        return acc;
    } ) , {} );

    const params = new URLSearchParams( reqParam ).toString();

    console.log( 'params' , params );
    fetch( `/payment/kakao-pay/ready?${ params }` , {
        method : 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'csrf-token' : paymentStore.csrfToken,
        },
    } )
        .then( res => {
            return res.json()
        } )
        .then( data => {
            console.log( '<< data >>' , data );
            window.open(data.redirectUrl,'_blank');
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
        } );
} );

/**
 * - 나이스페이 결제
 */
creditCardBtn.addEventListener( 'click' , ( e ) => {
    AUTHNICE.requestPay( {
        clientId : paymentStore.niceClientId,
        method : 'card',
        orderId: Math.random().toString(16).substr(2, 8),
        amount : paymentStore.amount,
        goodsName: paymentStore.name,
        returnUrl: paymentStore.niceReturnURL, //API를 호출할 Endpoint 입력
        fnError: function (result) {
            alert('개발자확인용 : ' + result.errorMsg + '')
        }
    } );
} );