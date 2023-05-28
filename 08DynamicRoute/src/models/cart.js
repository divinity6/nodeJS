const fs = require( 'fs' );
const path = require( 'path' );

const _path = path.join(
    path.dirname( process.mainModule.filename ) ,
    'data' ,
    'cart.json'
);

/**
 * - Cart 클래스
 * @type {Cart}
 */
module.exports = class Cart {

    static addProduct( id , productPrice ) {
        /**
         * - 파일이 존재하지 않으면 빈 제품과 값을 설정하고,
         *   존재하면 파일내부의 값을 가져온다
         */
        // Fetch the previous cart
        fs.readFile( _path , ( err , fileContent ) => {
            let cart = { products : [] , totalPrice : 0 };
            if ( !( err ) ){
                cart = JSON.parse( fileContent );
            }

            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex( prod => prod.id === id );
            const existingProduct = cart.products[ existingProductIndex ];

            // Add new product / increase quantity
            let updateProduct;
            if ( existingProduct ){
                updateProduct = {
                    ...existingProduct ,
                    qty : existingProduct.qty + 1
                };

                cart.products = [ ...cart.products ];
                cart.products[ existingProductIndex ] = updateProduct;
            }
            else {
                updateProduct = { id , qty : 1 }
                cart.products = [ ...cart.products , updateProduct ];
            }
            cart.totalPrice = cart.totalPrice + Number( productPrice );
            /**
             * - 파일 저장
             */
            fs.writeFile( _path , JSON.stringify( cart ) , ( err ) => {
                console.log( "err" , err );
            } );
        } );
    }
}