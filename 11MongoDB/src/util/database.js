const mongodb = require( 'mongodb' );

const MongoClient = mongodb.MongoClient;

let _db;

/**
 * - mongoDB 에 연결
 *
 * @param callback
 */
const mongoConnect = ( callback ) => {
    /**
     * --> https://cloud.mongodb.com/ 에서 사용한 사용자이름과 password 를 입력하면 된다
     *
     * --> mongodb+srv://<userID>:<password>@atlascluster.ebvlee7.mongodb.net/?retryWrites=true&w=majority
     *
     * --> 이 연결객체는 데이터베이스에 연결할 수 있는 client Promise 객체를 반환한다
     */
    MongoClient
        /** shop 데이터베이스에 접근 */
        .connect( 'mongodb+srv://hoon:hoonTest@atlascluster.ebvlee7.mongodb.net/shop?retryWrites=true&w=majority' )
        .then( client => {
            console.log( '<<ConnectedMongoDB>>' );
            _db = client.db();
            callback();
        } )
        .catch( err => {
            console.log( '<<DataBaseConnectErr>> :' , err );
            throw err;
        } );
}

/**
 * - MongoDB 와 연결되어 해당 데이터베이스에 접근했으면 해당 DB 를 반환하는 함수
 * @return {*}
 */
const getDb = () => {
    if ( _db ){
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;

exports.getDb = getDb;
