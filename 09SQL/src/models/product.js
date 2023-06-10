/** database 에 접근하여 데이터를 읽어옴 */
const db = require( '../util/database' );

const Cart = require( './cart' );

/**
 * - 제품 단일 Model
 */
module.exports = class Product {
    /** database 에서 제품을 읽어 반환 */
    static fetchAll(){
        return db.execute( 'SELECT * FROM products' );
    }

    /** database 에서 전체 제품을 읽어 해당 id 의 제품을 찾아 반환 */
    static findById( id , callback ){
    }

    /** database 에서 전체 제품을 읽어 해당 id 의 제품을 제거 */
    static deleteById( id ){
    }

    title;
    imageUrl;
    description;
    price;
    id;

    constructor( id , title , imageUrl , description , price ) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
    }


}