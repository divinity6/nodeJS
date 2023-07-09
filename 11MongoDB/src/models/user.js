const mongodb = require( 'mongodb' );
/** 해당 함수를 이용하여 Database 와 연결할 수 있다 */
const getDb = require( '../util/database' ).getDb;
const ObjectId = mongodb.ObjectId;

class User {

    static findById( userId ){
        const db = getDb();

        /** _id 와 매치되는 ID prodcut 반환 */
        return db.collection( 'users' )
            /** 1 개의 요소만 찾는것이라면 findOne 메서드를 이용할 수 있다 */
            .findOne( { _id : new ObjectId( userId ) } )
            .then( user => {
                console.log( "<<findById FindUser>>" , user );
                return user;
            } )
            .catch( err => console.log( '<<UserFindErr>> :' , err ) );
    }

    name;
    email;
    _id;

    constructor( username , email , cart , id ) {
        this.name = username;
        this.email = email;
        this.cart = cart;  // { items : [] }
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection( 'users' ).insertOne( this );
    }

    /**
     * - 장바구니 추가
     * MongoDB 에서는 사용자가 cart 의 ID 를 들고있게 관계설정을 하여 편하게 설정할 수 있다
     */
    addToCart( product ){
        const cartProductIndex = this.cart.items.findIndex( cp => {
            /** toString 메서드로 ObjectId 의 문자열만 추출하여 사용할 수 있다 */
            return cp.productId.toString() === product._id.toString();
        } );
        let newQuantity = 1;
        const updatedCartItems = [ ...this.cart.items ];

        if ( 0 <= cartProductIndex ){
            newQuantity = this.cart.items[ cartProductIndex ].quantity + 1;
            updatedCartItems[ cartProductIndex ].quantity = newQuantity;
        }
        else {
            updatedCartItems.push( { productId : new ObjectId( product._id ) , quantity : newQuantity } )
        }
        const updatedCart = { items : updatedCartItems };
        const db = getDb();
        /** 기존 Cart 를 새로운 Cart 로 업데이트하여 반환 */
        return db.collection( 'users' ).updateOne(
            { _id : new ObjectId( this._id ) },
            { $set : { cart : updatedCart } }
        );
    }

    /** 사용자가 가진 cart 데이터들로 DB products collection 을 조회하여 product 들 반환 */
    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map( i => i.productId );
        return db.collection( 'products' )
            /** productIds 중 하나라도 일치하는 제품들 전부 반환 */
            .find( { _id : { $in : productIds } } )
            .toArray()
            /** 받은 제품중 제품 수량에 대한 정보를 포함하여 반환 */
            .then( products => {
                return products.map( p => {
                    return {
                        ...p ,
                        /** 자기카트 ID 와 product 의 id 가 맞는 product.quantity 반환 */
                        quantity : this.cart.items.find( cp => {
                            return cp.productId.toString() === p._id.toString();
                        } ).quantity,
                    }
                } )
            } )
            .catch( err => console.log( '<<UserGetCartErr>> :' , err ) );
    }

    /** cart 에서 item 제거 */
    deleteItemFromCart( productId ){
        const updatedCartItems = this.cart.items.filter( item => {
            return item.productId.toString() !== productId.toString();
        } );

        const db = getDb();
        /** 기존 Cart 를 새로운 Cart 로 업데이트하여 반환 */
        return db.collection( 'users' ).updateOne(
            { _id : new ObjectId( this._id ) },
            { $set : { cart : { items : updatedCartItems } } }
        );

    }

    /** 주문 추가하기 */
    addOrder(){
        const db = getDb();
        /**
         *  - 주문시 product.price 등 다른 정보가 필요하기 때문에,
         *    getCart() 로 product 의 모든정보를 먼저 가져온다
         *
         *  --> id 와 quantity 만 포함하는게 아니라, 제품 정보모두를 포함하여 반환
         *
         *  --> 해당 정보들은 snapshot 이기 때문에, 지난정보와 일치하지 않아도 괜찮다
         */
        return this.getCart()
            .then( products => {
                const order = {
                    items : products,
                    /**
                     * - 사용자 정보를 담게 되면,
                     *   사용자 정보가 바뀌었을 경우에는 해당 정보로 업데이트 해줘야한다
                     */
                    user : {
                        _id : new ObjectId( this._id ),
                        name : this.name,
                    }
                }

                /** 현재 cart 를 주문에 추가 */
                return db.collection( 'orders' ).insertOne( order );
            } )
            /** 장바구니 비우기 */
            .then( result => {
                this.cart = { items : [] };

                /** 데이터베이스 업데이트 */
                return db.collection( 'users' ).updateOne(
                    { _id : new ObjectId( this._id ) },
                    { $set : { cart : this.cart } }
                );
            } )
            .catch( err => console.log( '<<AddOrderErr>> :' , err ) );
    }

    /** 주문정보들을 불러오기 */
    getOrders(){
        const db = getDb();
        return db.collection( 'orders' )
            /** find 메서드시 path 를 key 로 입력하여 내부 중첩된 user._id 에 매핑되는 값들을 가져올 수 있다 */
            .find( { 'user._id' : new ObjectId( this._id ) } )
            .toArray()
    }
}

module.exports = User;