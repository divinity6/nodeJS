const path = require("path");

const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const errorController = require( './controllers/error' );
const sequelize = require( './util/database' );
const Product = require( './models/product' );
const User = require( './models/user' );
const Cart = require( './models/cart' );
const CartItem = require( './models/cart-item' );

const app = express();

/**
 * - ejs 라이브러리를 view engine 으로 사용
 */
app.set('view engine', 'ejs');

/**
 *  - 서버에서 렌더링 할 뷰가 위치한 디렉토리 경로를 설정하는 역할.
 *
 */
app.set('views', './views');

/**
 * - 내보낸 router 파일을 import
 */
const adminRoutes = require( './routes/admin.js' );

const shopRoutes = require( './routes/shop.js' );

/**
 * - 본문 해석 미들웨어
 *
 * - urlencoded 메서드는 내부에서 next 를 호출하여
 *
 * - 다음 라우팅 미들웨어를 실행하도록 해준다
 */
app.use( bodyParser.urlencoded({ extended : false } ) );

app.use( express.static( path.join( __dirname , 'public' ) ) );

app.use( ( req , res , next ) => {
    User.findByPk( 1 )
        .then( user => {

            /**
             * - 요청 객체에 사용자 정보 sequelize 객체 저장하여
             *   어디서든 접근하여 쓸 수 있도록 수정
             */
            req.user = user;
            next();
        } )
        .catch( err => console.log( '<<findUserErr>>' , err ) );
} );

app.use( shopRoutes );

app.use( '/admin' , adminRoutes );

app.use( errorController.get404 );

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
    onDelete : 'CASCADE' // 삭제가 Product 를 대상으로도 실행된다는 뜻( 사용자 삭제시 관련 가격도 모두삭제 등 : 기본값이다 )
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
 *     Sequelize 에서 user 객체에 Product 를 생성하는 메서드( createProduct )들을 자동으로 제공해서 넣어준다
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
    // .sync( { force : true } )
    .sync()
    /**
     * - 사용자 생성코드들
     */
    .then( result => {
        /**
         * - 1 번째 id 로 최소 한명의 사용자가 있는지 체크
         */
        return User.findByPk( 1 );
        // console.log( "result" , result );
    } )
    /** 처음 사용자 생성 */
    .then( user => {
        if ( !user ){
           return  User.create( { name : 'Max' , email: 'test@test.com' } );
        }
        return Promise.resolve( user );
    } )
    /** 처음 cart 생성 */
    .then( user => {
        return user.createCart();
    } )
    .then( cart => {
        app.listen( 3000 );
    } )
    .catch( err => {
        console.log( "err" , err );
    } );

