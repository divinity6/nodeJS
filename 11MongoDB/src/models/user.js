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
     * - MongoDB 에서는 사용자가 cart 의 ID 를 들고있게 관계설정을 하여 편하게 설정할 수 있다
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
}

module.exports = User;