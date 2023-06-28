const mongodb = require( 'mongodb' );

const MongoClient = mongodb.MongoClient;

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
        .connect( 'mongodb+srv://hoon:hoonTest@atlascluster.ebvlee7.mongodb.net/?retryWrites=true&w=majority' )
        .then( client => {
            console.log( '<<ConnectedMongoDB>>' );
            callback( client );
        } )
        .catch( err => {
            console.log( '<<DataBaseConnectErr>> :' , err );
        } );
}

module.exports = mongoConnect;

