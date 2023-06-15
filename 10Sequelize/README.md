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

- 