## Mongoose


- SQL 에 Sequelize 가 있었던 것처럼 MongoDB 에는 Mongoose 가 존재한다


### What is Mongoose?

- Mongoose 가 무엇인지 사용해본다


- Mongoose : **Object-Document Mapping Library**


- Sequelize : **Object-Relational Mapping Library**


- Mongoose 가 단순히 관계형 데이터베이스가 아니라 **문서형 데이터베이스로**
  - Document 관점으로 실행되는 ODM 이라는 것이다


- 그러나 둘다 User 테이블을 Collection 에 저장한다는 개념은 같다

|    User    |
|:----------:|
|   - name   |
|   - age    |
|  - email   |
| - password |


- **Mapped( 해당 테이블에 매핑함 )**


| id  |  name  | age  | password  |
|:---:|:------:|:----:|:---------:|
|  1  | 'max'  | '28' | 'dsdg312' |


````javascript
/** Mongoose 를 사용하지 않고 직접 접근 */
db.collection( 'users' ).insertOne( { name : 'Max', age : 28, password: 'dsdg312' } );
````

- 객체와 데이터에 초점을 맞춰 Mongoose 를 사용하면 이것보다 더 간결하게 CRUD 를 진행할 수 있다


- Sequelize 처럼 Mongoose 도 Model 을 정의해 Query 가 배후에서 동작하도록 한다

````javascript
/** Mongoose */
const user = Usesr.create( { name : 'Max', age : 28, password : 'dsdg312' } );
````

---

### CoreConcepts

- 스키마와 모델을 이용해 데이터가 어떻게 보일지 정의하는것이 Mongoose 의 핵심 컨셉이다


- Model 객체를 JS instance 로 생성할 수 있게 도와준다
  - ( SQL 의 Sequelize 와 매우 비슷한 개념이다 )


- [ Mongoose 공식 홈페이지 ]( https://mongoosejs.com/ )
  - 여기서 다루지않는 세부내용들을 확인할 수 있다


---

- 기존에 작성한, util/database.js 를 사용할수도 있지만, 
  - **Mongoose 자체가 배후에서 데이터베이스와의 연결을 관리**하기 때문에
  - database 파일을 제거하고 Mongoose 를 불러오게 설정하면 된다

---

### Mongoose import

````javascript
/** ===== app.js ===== */
/** mongoose 연결 */
const mongoose = require( 'mongoose' );

/** mongoose 가 mongoDB 와의 연결을 관리한다 */
mongoose
        /** shop 데이터베이스에 연결 */
        .connect( 'mongodb+srv://hoon:hoonTest@cluster0.ipnka4b.mongodb.net/shop?retryWrites=true' )
        .then( result => {
          console.log( "<<StartApp>>" );
          app.listen( 3000 );
        } )
        .catch( err => {
          console.log("<<StartApp Err>>", err);
        } );

````


- mongoose 는 Schema less 하지만,


- 데이터 타입이 중요할 경우에는, Schema 를 정의하여 사용할 수 있다


- id 는 정의하지 않으면 ObjectId 로 자동 정의되고 추가되기 때문에, 정의하지 않아도 된다

````javascript
/** ===== models/product.js ===== */
/** Mongoose */
const mongoose = require( 'mongoose' );
/** mongoose Schema constructor */
const Schema = mongoose.Schema;
/** 제품의 스키마( 청사진 ) 정의 */
const productSchema = new Schema( {
  title : {
    type : String,
    required : true,
  },
  price : {
    type : Number,
    required : true,
  },
  description : {
    type : String,
    required : true,
  },
  imageUrl : {
    type : String,
    required : true,
  }
} );

/**
 * - mongoose Schema 를 Product 모델에 설정하고 내보냄
 *
 * --> 이렇게 설정하면 Mongoose 가 소문자 및 복수형 이름으로
 *     데이터베이스 collection 을 만들어 사용한다
 */
module.exports = mongoose.model( 'Product' , productSchema );
````

### Mongoose find

- find 메서드를 이용해 해당 collection 의 모든 데이터를 가져올 수 있다

````javascript
const Product = require( '../models/product' );

/**
 *  - find 로 모든 제품을 가져올 수 있다
 */
Product.find()
        .then( products => {
          res.render( 'shop/product-list' , {
            prods : products ,
            pageTitle : 'All Products' ,
            path : '/products' ,
          } );
        } )
        .catch( err => console.log( '<<getProductsFetchErr>> :' , err ) );
````


### Mongoose findById

- findById 메서드를 통해 id 에 맞는 데이터를 가져올 수 있다

````javascript
const Product = require( '../models/product' );

/**
 * - id 를 이용한 단건 제품 조회
 * 
 * --> 파라미터로 string 을 전달하면 Mongoose 에서 ObjectId 로 변환해준다
 */
Product.findById( prodId )
        .then( ( product ) => {
          res.render( 'shop/product-detail' , {
            pageTitle : product.title ,
            path : '/products',
            product :product,
          } )
        } )
        .catch( err => console.log( '<<getProductFetchErr>> :' , err ) );
````

### Mongoose Update

- Mongoose Doc 데이터 업데이트


- findById 로 id 에 맞는 데이터를 찾고, 해당 데이터 모델의 save 메서드를 호출하여 업데이트!

````javascript
const Product = require( '../models/product' );

/**
 * - id 를 이용한 단건 제품 조회
 * 
 * --> 파라미터로 string 을 전달하면 Mongoose 에서 ObjectId 로 변환해준다
 */
Product
        .findById( prodId )
        /**
         * - product 가 mongoose 객체이기 때문에,
         *   해당 model 객체의 프로퍼티를 수정해주고,
         *   저장해주면 업데이트가 된다
         */
        .then( product => {
          product.title = title;
          product.price = price;
          product.imageUrl = imageUrl;
          product.description = description;

          return product.save();
        } )
        .then( result => {
          console.log( '<<updatedData>> :' , result );
          res.redirect( "/admin/products" );
        } )
        .catch( err =>  console.log( '<<findDataFetchErr>> :' , err ) );
````

### Mongoose Delete

- Mongoose Doc 제거

- Mongoose 에서 제공하는 findByIdAndRemove 메서드만 사용하면 Doc 을 제거할 수 있다

````javascript
const Product = require( '../models/product' );

Product.findByIdAndRemove( prodId )
        .then( result => {
          res.redirect( "/admin/products" );
        } )
        .catch( err => console.log( '<<findDataFetchErr>> :' , err ) );
````