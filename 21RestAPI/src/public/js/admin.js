/**
 * - 제품 제거 이벤트
 */
const deleteProduct = ( btn ) => {
   const prodId = btn.parentElement.querySelector('[name=productId]').value;
   const csrf = btn.parentElement.querySelector('[name=_csrf]').value;

   const productElement = btn.closest( 'article' );

   fetch( `/admin/product/${ prodId }` , {
      method : 'DELETE',
      headers : {
         'csrf-token' : csrf
      }
   } )
       .then( result => {
          return result.json();
       } )
       .then( data => {
          console.log( '<< data >>' , data );
          productElement.parentElement.removeChild( productElement );
       } )
       .catch( err => {
          console.log( '<< err >>' , err );
       } )
};