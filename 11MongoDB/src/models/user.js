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
            .findOne( { _id : new ObjectId( userId ) } );
    }

    name;
    email;

    constructor( username , email) {
        this.name = username;
        this.email = email;
    }

    save(){
        const db = getDb();
        return db.collection( 'users' ).insertOne( this );
    }
}

module.exports = User;