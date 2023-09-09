/**
 * - 결제 테스트
 * @param el
 */
const onPayment = ( el ) => {
    const csrfEl = el.parentElement.querySelector( `[name=_csrf]` );

    const csrf = csrfEl.value;

    console.log( 'onPayment' , el );

    fetch( `/payment` , {
        method : 'POST',
        headers : {
            'csrf-token' : csrf
        }
    } )
        .then( res => {
            return res.json()
        } )
        .then( data => {
            window.open(data.kakaoData.next_redirect_pc_url,'_blank');
            console.log( '<< data >>' , data );
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
        } )
}