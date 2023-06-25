## Sequelize

- MySQL 데이터베이스를 사용하지만, 사용하는 코드가 다르다

````javascript
/**
 * - 이런 SQL 문 대신, 외부 패키지를 통해 JS 객체로 데이터베이스에 간편하게 CRUD 를 할 수 있다
 */
db.execute( 'INSERT INTO products ( title , price , imageUrl , description ) VALUES (?, ?, ?, ?)',
    [ this.title , this.price , this.imageUrl , this.description ] );

````

### What is Sequelize?

- Sequelize 는 제 3자 외부 패키지로 Object-Relational Mapping 라이브러리이다
  - ( 백그라운드에서 실제로 SQL 코드를 처리하며, JS 객체로 매핑해 SQL 코드를 실행하는 편리한 메서드를 제공한다 )


- 객체가 Sequelize 에 의해 데이터베이스에 매핑되면, 테이블을 자동으로 생성한다
  - ( 테이블 뿐만아니라, 관계까지 자동으로 설정까지해준다 )


- 즉, Sequelize 내부에서 쿼리를 실행해 데이터베이스에 접근한다


- Sequelize 는 데이터베이스를 다루는 Model 을 제공하며, 모델을 정의할 수 있게한다.


- sequelize 설치
````shell
npm install --save sequelize
````

### Sequelize

- sequelize 는 백그라운드에서 mysql2 를 내무적으로 사용하기 때문에 설치해두어야한다


- sequelize 를 이용한 모델 설정예시


````javascript
const Sequelize = require( 'sequelize' );

const sequelize = require( '../util/database' );

/**
 * - 제품 단일 Model
 */
const Product = sequelize.define( 'product' , {
  id : {
    type : Sequelize.INTEGER,   // id 타입
    autoIncrement : true,   // 자동증가
    allowNull : false,      // null 을 허용함
    primaryKey : true,      // id 를 테이블의 기본 키로 설정
  },
  title : Sequelize.STRING,   // 유형만 설정( 세부설정 안할경우 )
  price : {
    type : Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl : {
    type : Sequelize.STRING,
    allowNull : false,
  },
  description : {
    type : Sequelize.STRING,
    allowNull : false,
  }
} );

/**
 * - 제품 생성
 *
 * --> Sequelize 는 db 에 저장시 비동기로 처리한다
 */
Product.create( {
  title,
  imageUrl,
  description,
  price
} )
.then( result => {
  console.log( '<<Created Product by Database>> :' , result )
} )
.catch( err => {
  console.log( '<<AddDataFetchErr>> :' , err )
} );

/**
 *  - 전체 제품 조회
 *
 *  --> where 문을 이용해 원하는 조건을 필터링할 수 있다
 */
Product.findAll()
  .then( products => {
    res.render( 'shop/product-list' , {
      prods : products ,
      pageTitle : 'All Products' ,
      path : '/products' ,
    } );
  } )
  .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );

/**
 * - findAll 의 where 조건절을 이용한 데이터 조회
 */
Product.findAll( { where : {id : prodId} } )
  .then( ( [ product ] ) => {
    res.render( 'shop/product-detail' , {
      pageTitle : product.title ,
      path : '/products',
      product :product,
    } )
  } )
  .catch( err => console.log( '<<findDataFetchErr>> :' , err ) );

/**
 * - id 를 이용한 단건 제품 조회
 */
Product.findByPk( prodId )
  .then( ( product ) => {
    res.render( 'shop/product-detail' , {
      pageTitle : product.title ,
      path : '/products',
      product :product,
    } )
  } )
  .catch( err => console.log( '<<findDataFetchErr>> :' , err ) );

/**
 * - destroy 로 모든 제품 삭제
 *
 * --> where 조건을 통해 해당 쿼리에 해당하는 제품만 제거할 수 있다
 */
Product.destroy( {} );

````

- sequelize 에서 단건조회시 findById 대신 findByPk 를 사용할 것을 권장한다

````javascript
/**
 * - Sequelize
 */
// bad
Product.findById( prodId );

// good
Product.findByPk( prodId );

````

- sequelize 로 가져온 데이터의 save 메서드를 호출하면 데이터베이스에 저장시켜준다


- 만약, 해당데이터가 존재하지 않는다면 새로 생성하고, 존재한다면 업데이트해준다

````javascript

// good
Product.findByPk( prodId ).then( product => {
  /**
   * - update Product!!
   * 
   * Promise 를 반횐한다
   */
  product.save(); // 데이터베이스에 저장

  /**
   * - delete Product!!
   * 
   * Promise 를 반횐한다
   */
  product.destroy(); // 데이터 베이스에서 삭제
} );

````


- sequelize 에서는 자동으로 table 이 없더라도 생성하도록 명령을 내릴 수 있다


````javascript

const sequelize = require( '../util/database' );

/**
 * - sequelize.sync 메서드는 define 으로 정의한 모든 모델들을 살펴본다
 * 
 * -->  그 후 모델들을 데이터베이스와 동기화해, 테이블을 생성하고 관계가 있다면 관계도 생성한다
 */
sequelize.sync()

````

### Associations - 관계 설정

- 사용자는 장바구니를 하나씩 가지고 있고, 장바구니에는 여러 제품이 들어갈 수 있다


- 또한, 사용자는 여러 주문을 보유할 수 있고, 제품또한 여러 주문을 보유할 수 있다


- 따라서, User , Cart, Product Table 끼리 관계를 맺도록 설정해야한다


- 관계를 맺도록 설정하는 방법

````javascript
const Product = require( './models/product' );
const User = require( './models/user' );
const Cart = require( './models/cart' );
const CartItem = require( './models/cart-item' );

/**
 * - Product 와 User Table 이 관계를 맺는다는 뜻인데,
 *
 * User Table 안에 Product 가 속하는 관계 설정
 * ( 즉, 사용자가 제품을 생성했다라는 뜻 )
 *
 * - 두번째 파라미터로 해당 관계가 어떻게 관리될지를 정의할 수 있다
 */
Product.belongsTo( User , {
  constraints : true, // 데이터 무결성을 유지하기위해 외래 키 제약조건 생성
  onDelete : 'CASCADE' // 삭제가 Product 를 대상으로도 실행된다는 뜻( 사용자 삭제시 관련 가격도 모두삭제 등 )
} );

/**
 * - User 모델이 Product 모델을 여러개 가지는 관계를 설정한다는 뜻
 *
 * --> 사용자는 하나 이상의 제품을 상점에 추가할 수 있기 때문
 *
 * --> ( options )belongsTo 를 hasMany 로 대체할 수 있다
 *
 * --> 따라서, 현재는 양방향으로 관계를 맺고 있다
 * 
 * --> User 와 Product 가 관계를 맺고 있기 때문에,
 * Sequelize 에서 user 객체에 Product 를 생성하는 메서드들을 자동으로 제공해서 넣어준다
 */
User.hasMany( Product );

/**
 * - 사용자는 1 개의 장바구니를 가지고,
 *   장바구니는 User 에 속하는 관계 설정
 *
 * - 또한 Cart 는 많은 수의 제품에 속함
 * - 반대로 하나의 제품이 다수의 장바구니에 속하기도 함
 *
 * - 다대다 관계, 즉, 하나의 장바구니가 여러 제품을 담을 수 있고,
 *   한 제품이 여러개의 장바구니에 들어갈 수 있음
 *
 * --> 이렇게 설정해두면 앞에 get 이붙은 접두어로 해당 데이터를 가져올 수 있다
 *
 * --> user.getCart() : hasOne 이라 단수
 *
 * --> user.getProducts() : hasMany 라 복수
 */
User.hasOne( Cart );
Cart.belongsTo( User );
/**
 * - 이렇게 through 를 사용하게 되면,
 *   Cart 와 Product 는 연결테이블로써 CartItem 을 사용하게 된다
 *
 * - CartItem 은 Cart 의 key 와 Product 의 key 를 가지고 있어,
 *   서로 테이블의 값을 가져올때, 이 연결테이블을 이용해 가져올 수 있다
 */
Cart.belongsToMany( Product , { through : CartItem } );
Product.belongsToMany( Cart , { through : CartItem } );


/**
 * - 데이터베이스와 sync 를 맞춘 후 앱을 실행한다
 *
 * --> 위의 관계를 맺는 메서드들을 작성한 상태에서는 모델에 대한 Table 을 생성하고,
 *     정의하는 관계들을 데이터베이스 내부에 정의해 준다
 *
 * --> sync : 데이터베이스와 모델간의 동기화
 */
sequelize
        .sync( {
          force : true, // 기존 테이블을 강제로 제거하고 새로 스키마를 적용한다( 실제 데이터가 모두 손실될 수 있음 )
        } )
        .then( result => {
          // console.log( "result" , result );
          app.listen( 3000 );
        } )
        .catch( err => {
          console.log( "err" , err );
        } );

````

- Sequelize 에서 해당 테이블을 포함하는 관계를 맺으면, 관계를 맺은 테이블을 생성하는 메서드를 제공해준다

````javascript

/**
 * - User 모델이 Product 모델을 포함하는 관계를 맺음
 */
User.hasMany( Product );

/**
 * - 어디서든 사용할 수 있게 req 객체에 user sequelize 할당 
 */
app.use( ( req , res , next ) => {
  User.findByPk( 1 )
          .then( user => {
            req.user = user;
            next();
          } )
          .catch( err => console.log( '<<findUserErr>>' , err ) );
} );


/**
 * - 해당 데이터를 자동으로 database 에 저장한다
 *
 * --> Sequelize 는 db 에 저장시 비동기로 처리한다
 *
 * --> Sequelize 에서 관계설정시 자동으로 해당 관계된 테이블 생성 메서드를 지원해준다
 */
req.user.createProduct( {
  title,
  price,
  imageUrl,
  description,
} )
````

### Module Summary

- SQL 데이터베이스는 스키마 엔진 유형으로, 엄격한 데이터 스키마와 데이터베이스 관계를 사용한다


- Nodejs 에서 mysql2 같은 패키지를 이용해 쉽게 데이터베이스에 연결할 수 있다
  - 이때, 직접 테이블을 추가하고, 테이블간 관계를 설정해야해야해서 번거롭다


- 그러나, Sequelize 를 이용하면 JS 만으로 SQL 쿼리를 작성하지 않고도 , 
  - 정의한 **Model 들을 가지고 데이터베이스와 상호작용할 수 있다**
  - 관계설정( Associations )또한 마찬가지다


- Sequelize 공식 참고자료:  http://docs.sequelizejs.com/