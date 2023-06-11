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
        /**
         * - 삽입 명령 , 해당 테이블명, 테이블 필드명 테이블 값
         *
         * --> VALUES 에 데이터를 삽입할때, SQL 인젝션 공격을 방지하기 위해 ? 를 사용한다
         *
         * --> 그후 다음 파라미터로, 삽입할 데이터를 순서에 맞게 전달한다
         *
         * --> 이렇게 하면, MySQL 에서 안전하게 파싱해 전달해준다
         */
        return db.execute( 'INSERT INTO products ( title , price , imageUrl , description ) VALUES (?, ?, ?, ?)',
            [ this.title , this.price , this.imageUrl , this.description ] );
    }


}