/** 해당 함수를 이용하여 Database 와 연결할 수 있다 */
const getDb = require( '../util/database' ).getDb;

class Product {

    static fetchAll(){
        const db = getDb();
        /**
         * - db collection 중 products 를 선택후, find 메서드로
         *
         * 단계별로 mongoDB 요소들과 문서를 탐색
         */
        return db
            .collection( 'products' )
            .find()
            .toArray()
            .then( products => {
                console.log( "<<FindProducts>>" , products );
                return products;
            } )
            .catch( err => console.log( '<<DataFindErr>> :' , err ) );
    }

    title;
    price;
    description;
    imageUrl;

    constructor( title , price , description , imageUrl ) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    /**
     *
     * @return {Promise<undefined | void>}
     */
    save(){
        const db = getDb();
        /**
         * @db.collection
         *
         * - MongoDB 에게 입력, 작업등을 진행할 컬렉션을 지정해줄 수 있다.
         *
         */
        return db.collection( 'products' )
            /**
             * - MongoDB 에 데이터하나 삽입
             *
             * --> MongoDB 에서 변환한다
             *
             * --> MongoDB 에서 자동으로 ID 를 삽입한다
             *
             * @return { Promise }
             */
            .insertOne( this )
            .then( result => {
                console.log(  '<<DataInsert> :' , result );
            } )
            .catch( err => console.log( '<<DataInsertErr>> :' , err ) );
    }
}

module.exports = Product;