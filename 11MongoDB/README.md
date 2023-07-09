## NoSQL Databases / MongoDB

- NoSQL 기반 데이터베이스인 MongoDB 또한 SQL 데이터베이스만큼 많이 사용한다


---

### What is MongoDB?

- MongoDB 는 회사이름이기도 하지만, 그 회사의 메이저 제품인 데이터베이스 솔루션, 엔진 이름이다


- 효율적인 NoSQL 데이터베이스를 실행할 수 있는 툴이다
  - ( 규모가 큰 어플리케이션을 위해 구축된 DB 다 )


- 데이터 쿼리, 저장 ,상호작용등 아주 빠르게 처리할 수 있으며, 
  - NoSQL 데이터베이스와 MongoDB 가 기반한 훌륭한 데이터베이스다

---

### How it works

- SQL 의 경우, 데이터베이스에 테이블이 여러개 있지만, 


- NoSQL MongoDB 의 경우, Collection 이 여러개 있다


- 또한, 각 Collection 에는 기록이 아닌, Document 가 존재한다
  - ( 명칭만 다른게 아니라, 이 데이터베이스의 핵심 철학에 큰 차이점이 있다 )


- MongoDB 는 Schemaless 로 
  - Collection 의 Document( 데이터 or 항목 )가 같은 구조를 가질 필요가 없다
  - 즉, 한 Collection 안에 어떤 유형의 데이터가 있어도 상관 없다


|    **Database**    |                                            Shop                                            |
|:------------------:|:------------------------------------------------------------------------------------------:|
|  **Collections**   |                                       Users, Orders                                        |
|   **Documents**    | Users : [ { name : 'Max' , age : 29 } , { name : 'Manu' } ] , Orders [ { ... } , { ... } ] |


#### JSON ( BSON ) Data Format

- MongoDB 의 데이터 표기는 JSON 표기법이다
  - JSON 표기법을 이용해 데이터를 저장한다
  - 엄밀히 말하면 Binary JSON 인 Binary JSON 이다

  
- 따라서, 데이터 유연성이 매우 크다고 볼 수 있다


````json
{
  "name" : "Max",
  "age" : 29,
  "address" : {
    "city" : "Munich"
  },
  "hobbies" : [
    {"name" :  "Cooking"},
    {"name" :  "Sports"}
  ]
}
````

---

### What's NoSQL

- NoSQL 에서는 아래와 같이 중복되는 데이터 구조가 있는 형태가 자주 나타난다


- 해당 데이터의 일부가 다른 문서에 내장 or 중첩되어 있을 가능성이 높다


- 따라서, SQL 처럼 root 의 id 를 이용해 패칭하는 것이 아니라, 다른 문서를 가르키는 ID 를 내장하여, 두 문서를 병합하는 방식을 사용한다


- 그러나, 중점이 되는 정보만 가지고, 다른 문서에서 함꼐 가져올 수 있다
  - 예) 
    - orders 테이블이 user 테이블 정보를 embed 하고 있으면, 
    - orders 테이블을 검색할때마다, user 테이블을 검색할 필요가 없다
    - **이측면에서 MongoDB 가 훨씬 빠르고 효율적인 것이다**


- 즉, 서버의 백그라운드에서 여러 컬렉션을 합치지 않고도, 필요한 형식의 데이터를 가져올 수 있다


- **Order 테이블**

| { id : 'ddjfa31' , user : { id : 1 , email : 'max@test.com' } , product : { id : 2 , price : 10.99 } }  |
|:-------------------------------------------------------------------------------------------------------:|
| { id : 'lddao1' , user : { id : 2 , email : 'manu@test.com' } , product : { id : 1 , price : 120.99 } } |
|                        { id : 'nbax12' , product : { id : 2 , price : 10.99 } }                         |
|                                                 { ... }                                                 |


- **Users 테이블**

| { id : 1 , name : 'Max' , email : 'max@test.com' }  |
|:---------------------------------------------------:|
| { id : 2 , name : 'Manu', email : 'manu@test.com' } |
|                       { ... }                       |


- **Products 테이블**

| { id : 1 , title : 'Chair' , price : 120.99 } |
|:---------------------------------------------:|
|   { id : 2 , name : 'Book', price : 10.99 }   |
|                    { ... }                    |

---

### Relations - Options

#### Nested / Embedded Documents

- **Customers 테이블**

````json
{
  "userName" : "Max",
  "age" : 29,
  "address" : {
    "street" : "Second Street",
    "city" : "New York"
  }
}
````

- Customers 테이블에 address 객체가 있어서, 
  - 굳이 따로 id로 검색할 필요가 없는 장점이 있다

#### References

- 중복되는 데이터가 아주 많으며, 데이터를 많이 다뤄야해서 자주 변경될 경우, Nested 보단 Reference 가 좋은 방법이다


- 좋아하는 책이 자주 변경되는 **Customers 테이블**


- 자주 변경되어야 해서 좋지 않은 테이블

````json
{
  "userName" : "Max",
  "favBooks" : [ { ... } , { ... } ]
}
````

- 아래처럼, 분리하여 저장

````json
{
  "userName" : "Max",
  "favBooks" : [ "id1" , "id2" ]
}
````

````json
{
  "id" : "id1",
  "name" : "Lord of the Rings 1"
}
````

- 즉, 목적에 따라 Nested / Reference 를 사용하면 된다

---

- 결론적으로 **Schema 가 없어서, 특정 구조가 필요하지 않아 유연성이 향상**된다



#### Install MongoDB Driver


- [ MongoDB 아틀라스 ]( https://cloud.mongodb.com/ )
  - 위 사이트에서 몽고디비를 사용할 수 있고, npm 으로 드라이버를 다운로드 받을 수 있다


- MongoDB Atlas 에 권한을 설정할때, 사용자에게 읽기 쓰기 권한정도를 주는것이 현실적이긴하다
  - ( NodeJS 로 데이터베이스관리를 하지 않기에... )


- MongoDB 의 NetworkAccess 에 자기자신 LocalIP 주소를 넣어줘야 엑세스할 수 있다



- npm 으로 mongodb 에 엑세스하기위한 driver 를 설치할 수 있다
````shell
npm install --save mongodb
````

#### NodeJS MongoDB 연결

````javascript
// utils.database.js

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
            console.log( '<<Connected>> : ' , client );
            /** mongoDB 접근 */
            client.db();
            callback( client );
          } )
          .catch( err => {
            console.log( '<<DataBaseConnectErr>> :' , err );
          } );
}

module.exports = mongoConnect;


````

- MongoDB 는 MySQL 과 다르게, 해당 이름의 Database 에 접근하면 즉석에서 자동으로 생성해준다
  - ( 높은 유연성 )
  - 해당 이름으로 접근하라고 알리면, MongoDB 에 해당 데이터베이스가 없으면 즉시 생성해준다

````javascript
/** mongoDB 연결 */
const mongoConnect = require( './util/database' );

mongoConnect( ( client ) => {
  console.log( "<<StartApp>>" , client );
  /**
   * - client 의 Database 생성
   */
  client.db();
  app.listen( 3000 );
} );

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

````

#### MongoDB insert

- MongoDB 에 insert Data

````javascript
const db = getDb();
/**
 * @db.collection
 *
 * - MongoDB 에게 입력, 작업등을 진행할 컬렉션을 지정해줄 수 있다.
 *
 */
db.collection( 'products' )
        /**
         * - MongoDB 에 데이터하나 삽입
         *
         * --> MongoDB 에서 변환한다
         *
         * @return { Promise }
         */
        .insertOne( this );

````

#### MongoDB find

- MongoDB 의 데이터 탐색

````javascript
const db = getDb();
/**
 * - db collection 중 products 를 선택후, find 메서드로
 *
 * 단계별로 mongoDB 요소들과 문서를 탐색
 * 
 * @return { Promise<Array<any>> } - Promise 객체를 반환한다 
 */
db.collection( 'products' )
        .find()
        /** 찾은 요소를 Array 형태로 반환 */
        .toArray();

/** _id 와 매치되는 prodcut 단건 반환 */
db.collection( 'products' )
        /** mongoDB 는 id 가 아닌 _id 형태로 저장 */
        .find( { _id : new mongodb.ObjectId( 'SomeFIndID' ) } )
        /** 요소하나를 찾고 끝냄 */
        .next()

/** _id 와 매치되는 prodcut 여러 반환 */
db.collection( 'products' )
        /** 배열안의 id 중 하나라도 해당되는 product 전부 반환 */
        .find( { _id : { $in : [ 'SomeFIndID1' , 'SomeFIndID2' ] } } )
        /** 찾은 요소를 Array 형태로 반환 */
        .toArray();

````

- ID 를 통해 MongoDB 의 테이블에 접근할때, 


- MongoDB 는 ID 를 BSON 형식으로 저장하는데, 내부적으로 ObjectId 객체로 생성해 저장한다


- 따라서, ObjectId 형식으로 만들어서 접근해야한다


---

#### MongoDB update

- MongoDB 에 update Data

````javascript
const db = getDb();
/**
 * @db.collection
 *
 * - MongoDB 에게 업데이트, 작업등을 진행할 컬렉션을 지정해줄 수 있다.
 *
 */
db.collection( 'products' )
        /**
         * - MongoDB 에 데이터하나 업데이트
         *
         * --> MongoDB 의 mongodb.ObjectId 객체를 만들어야 mongodb 의 id 를 찾을 수 있다
         *
         * --> 그 후 $set 으로 mongodb 의 데이터베이스에 set( update ) 한다
         *
         * @return { Promise }
         */
        .updateOne(
        { _id : new mongodb.ObjectId( this._id ) } ,
        { $set : this } );

````


---

#### MongoDB delete

- MongoDB 에 delete Data

````javascript
const db = getDb();
/**
 * @db.collection
 *
 * - MongoDB 에게 업데이트, 작업등을 진행할 컬렉션을 지정해줄 수 있다.
 *
 */
db.collection( 'products' )
        /**
         * - MongoDB 에 데이터하나 제거
         *
         * --> MongoDB 의 mongodb.ObjectId 객체를 만들어야 mongodb 의 id 를 찾을 수 있다
         *
         * --> 찾은 데이터를 제거한다
         *
         * @return { Promise }
         */
        .deleteOne( { _id : new mongodb.ObjectId( prodId ) } )

````

- 데이터를 저장할때, 제품 테이블에서는 사용자의 정보들을 알 필요가 없다


- 따라서, 제품테이블에는 해당 제품을 가지고 있는 UserId 만 저장하면 된다


- 그러나, 주문등을할때는, 사용자 정보가 필요할 수 있으므로, 사용자 정보를 저장하는 방향으로 간다


- 즉, 상황에 따라 저장하는데이터를 유동적으로 처리하면 된다


- MongoDB 는 관계를 설정하는 table 이 필요없기 때문에, 불러올때, 직접 통합해줘야 한다

---

#### MongoDB ObjectId

- js 내장객체인 toString() 메서드를 가지고 있어, 이를 이용하여 id 문자열만 비교할 수 있다

````javascript

const mongodb = require( 'mongodb' );

const ObjectId = mongodb.ObjectId;

const id = new ObjectId( '123' );

console.log( id.toString() === '123' );
````

#### MongoDB nested-find

- MongoDB 에는 경로를 지정하여 객체내부에 중첩된 속성을 확인할 수 있다

````javascript
const mongodb = require( 'mongodb' );
const db = getDb();
const ObjectId = mongodb.ObjectId;
/**
 * - db collection 중 products 를 선택후, find 메서드로
 *
 * 단계별로 mongoDB 요소들과 문서를 탐색
 * 
 * @return { Promise<Array<any>> } - Promise 객체를 반환한다 
 */
db.collection( 'products' )
        /** find 메서드시 path 를 key 로 입력하여 내부 중첩된 user._id 에 매핑되는 값들을 가져올 수 있다 */
        .find( { 'user._id' : new ObjectId( this._id ) } )
        /** 찾은 요소를 Array 형태로 반환 */
        .toArray();

````

---

- CRUD 를 진행하다보면, products DB 와 users.cart DB 데이터의 정합성이 맞지 않는일이 발생한다


- 이럴 경우, 2가지 방법을 사용할 수 있다


1. worker 프로세스를 추가하는 것이다
   - 즉, 서버에 실행되는 스크립트로 24시간등 일정 주기로 데이터베이스를 체크하는데 사용자의 cart 를 스캔해서,
   - **products 컬렉션에서 찾을 수 없는 제품을 찾은 후 장바구니를 정리하는 과정**을 server app 에서 진행할 수 있다


2. getCart 로 장바구니의 데이터를 업데이트 할때, 
   - DB user.cart 의 데이터와 서버의 UserModel 데이터를 대조해, 
   - UserModel 데이터를 업데이트하는 방식을 사용할 수 있다

---

### Module Summary

- MongoDB 는 단지 SQL 데이터베이스의 대안으로 전혀 다른 철학을 따른다
  - ( SQL 만큼 엄격한 스키마도 없고, 관계도 적어서 수많은 테이블에 데이터를 나누지 않아도 된다 )


- 대신 데이터를 내장하거나, 참조를 사용하고, 두가지를 섞어서 사용할 수도 있다
  - ( 즉, 더 유연하고 비교적 간단한 쿼리등을 작성할 수 있다 )


- MongoDB 를 사용할때는 공식 MongoDB 드라이버를 사용해야, 
  - insertOn(), find(), updateOne(), deleteOn() 등의 유용한 명령어들을 사용할 수 있다


- 모든 연산이 비동기 Promise 기반이라, 복잡한 로직들을 가독성있게 만들기 쉽다

---

- MongoDB 공식 참고자료: https://docs.mongodb.com/manual/core/security-encryption-at-rest/https://docs.mongodb.com/manual/


- SQL vs NoSQL : https://academind.com/learn/web-dev/sql-vs-nosql/


- MongoDB에 대해 더 알아보기 : https://academind.com/learn/mongodb