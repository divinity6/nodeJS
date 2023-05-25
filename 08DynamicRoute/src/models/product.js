const fs = require( 'fs' );
const path = require( 'path' );

/**
 * - 파일에서부터 제품을 가져오는 helper 함수
 *
 * @param {
 *      ( products : { [ fileName : string ] : any }[] , path? : string ) => void
 * } callback - 파일을 가져온 후 실행할 콜백
 *
 * @return void;
 */
const getProductsFromFile = ( callback ) => {
    /**
     * - Data 폴더의 products.json path
     */
    const _path = path.join(
        path.dirname( process.mainModule.filename ) ,
        'data' ,
        'products.json'
    );

    fs.readFile( _path ,( err, fileContent ) => {
        let products = [];

        if ( !( err ) ){
            products = JSON.parse( fileContent );
        }

        callback( products , _path );
    } );
}

/**
 * - 제품 단일 Model
 */
module.exports = class Product {
    /** fs 에서 제품을 읽어 callback 으로 전송 */
    static fetchAll( callback ){
        getProductsFromFile( callback );
    }

    title;
    imageUrl;
    description;
    price;
    id;

    constructor( title , imageUrl , description , price ) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){

        this.id = Math.random().toString();

        getProductsFromFile( ( products , _path ) => {
            /**
             * - 기존 파일에 새로운 파일을 추가하고, 파일시스템에 저장
             */
            products.push( this );

            fs.writeFile( _path , JSON.stringify( products ) , ( err ) => {
                console.log( err );
            } );

        } );
    }


}