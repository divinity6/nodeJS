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
  },
  userId : {
    /** ObjectId 타입으로 정의 */
    type : Schema.Types.ObjectId,
    /**
     * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
     *
     * --> 참조할 model 의 이름을 사용하면 된다
     */
    ref : 'User',
    required : true
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

### Mongoose Nested Schema

- 중첩된 데이터구조의 Schema 를 정의할때는 primitive 값이 나올때까지 내부 값을 설정해서 선언할 수 있다

````javascript
/** ===== models/user.js ===== */
const userSchema = new Schema( {
          name : {
            type : String,
            required : true,
          },
          email : {
            type : String,
            required : true,
          },
          cart : {
            /** Nested 데이터 구조일 경우에는 아래처럼 선언한다 */
            items : [
              {
                productId : {
                  /** ObjectId 타입으로 정의 */
                  type : Schema.Types.ObjectId,
                  /**
                   * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
                   *
                   * --> 참조할 model 의 이름을 사용하면 된다
                   */
                  ref : 'Product',
                  required : true,
                },
                quantity : {
                  type : Number,
                  required : true,
                }
              }
            ]
          }
        } );

module.exports = mongoose.model( 'User' , userSchema );
````

### Mongoose create

- new Model 을 이용하여 Mongoose 로 생성한 모델의 인스턴스를 생성한 후,


- 인스턴스의 save 메서드를 호출하여 새로운 Doc 을 생성할 수 있다


- id 참조시 Mongoose 모델 객체를 넣게되면, Mongoose 에서 해당 Model 객체에서 자동으로 ObjectId 를 추출해서 넣어준다


- 만약, Mongoose 객체자체를 넣고싶다면, MongooseModel._doc 으로 접근해서 넣어 줄 수 있다

````javascript
const Product = require( '../models/product' );

const product = new Product( {
  title ,
  price ,
  description ,
  imageUrl ,
  /** 
   * - Mongoose 에서는 user 전체를 넣어도 user._id 를 찾아서 할당해준다... 
   * 
   * --> 만약 user 모델 자체 값을 가져오고 싶다면, req.user._doc 으로 해당 Doc 데이터 전체를
   *     가져올 수 있다
   */
  userId : req.user
} );

/** mongoose 에서 save 메서드를 제공해준다 */
product.save()
        .then( result => {
          console.log( '<<Created Product by Database>> :' , result );
          res.redirect( '/admin/products' );
        } )
        .catch( err => {
          console.log( '<<AddDataFetchErr>> :' , err )
        } );
````


### Mongoose find

- find 메서드를 이용해 해당 collection 의 모든 데이터를 가져올 수 있다

````javascript
const Product = require( '../models/product' );

/**
 *  - find 로 모든 제품을 가져올 수 있다
 */
Product
        .find()
        /** 
         * 만약 userId 와 맞는 값들을 가져와야 할 경우
         * 가져와야할 경우 아래처럼 작성할 수 있다
         * 
         * ( nested 데이터인 경우에는 아래처럼 가능하다 )
         * .find( { { 'user.userId' : req.user._id } )
         */
        // .find( { { userId : req.user._id } )
        .then( products => {
          res.render( 'shop/product-list' , {
            prods : products ,
            pageTitle : 'All Products' ,
            path : '/products' ,
          } );
        } )
        .catch( err => console.log( '<<getProductsFetchErr>> :' , err ) );
````

- 해당 제품 중 다른 collection 을 참조하고 있는 값까지 채워오려면 populate 를 사용하면된다


- populate 파라미터로 해당 데이터 key( nested 일 경우 . 으로 이음 )를 입력해주면, 참조한 collection 정보를 채워 반환해준다


- 또한, 두번째 파라미터로 가져올 필드들을 입력해주면 해당 필드들만 가지고온다


- 즉, 중첩된 query 를 사용하는대신 한번에 모든 데이터를 얻게 해준다

````javascript
const Product = require( '../models/product' );

Product.find()
        /** 
         * - 데이터를 가져올때 title , price 필드는 가져오고 
         *   _id 필드는 제외한다는 이야기
         *   
         *   ( id 항상 가져와서 명시적으로 안가져온다고 설정해 줘야한다 ) 
         */
        .select( 'title price -_id' )
        /**
         * Schema 로 정의해둔 필드에 populate 를 하면,
         * 해당 필드값을 가진 collection 을 조회해서 데이터를 채워온다
         * 
         * - 데이터중 name 필드만 채워온다
         */
        .populate( 'userId' , 'name' )
        .then( products => {
          res.render( 'admin/products' , {
            prods : products ,
            pageTitle : 'Admin Products' ,
            path : '/admin/products' ,
          } );
        } )
        .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );
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

### Mongoose findOne

- 해당 collection 에서 발견하는 첫 Doc 을 반환한다

````javascript
const User = require( './models/user' );

User.findOne().then( user => {
  if ( !user ){
    const user = new User( {
      name : 'Max',
      email : 'max@test.com',
      cart : {
        items : []
      }
    } );
    user.save();
  }
} )
````

### Mongoose CreateMethod

- Mongoose 에서 해당 Model 객체에 메서드를 추가할때는 


- ModelSchema.methods 객체에 해당 메서드를 추가하여 메서드를 생성할 수 있다


- 이때, 메서드 내부의 this 가 Model 객체를 참조할 수 있도록 반드시 function 키워드를 사용해야 한다

````javascript
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
/** 사용자의 스키마( 청사진 ) 정의 */
const userSchema = new Schema( { ... } );

/**
 * - 장바구니 추가 메서드
 *
 * - 해당 Schema 에 메서드를 추가할때는 .methods 에 해당 메서드를 추가하면 된다
 *
 * --> 이때 내부 this 가 model 객체를 참조할 수 있도록 function 키워드를 사용해야 한다
 */
userSchema.methods.addToCart = function ( product ){
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
    updatedCartItems.push( {
      productId : product._id ,
      quantity : newQuantity
    } )
  }
  this.cart = { items : updatedCartItems };

  /** 자기자신의 save 메서드를 호출하여 업데이트 */
  return this.save();
}
````

- Mongoose 는 내부적으로 제공하는 메서드가 많이 존재하고, 사용자가 추가적인 메서드를 추가할 수 있다