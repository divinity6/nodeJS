const path = require("path");

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
/** mongoose 연결 */
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
/** MongoDB 에 세션데이터 저장 및 전달 */
const MongoDBStore = require( 'connect-mongodb-session' )( session );
const csrf = require( 'csurf' );
const flash = require( 'connect-flash' );

const errorController = require( './controllers/error' );
const User = require( './models/user' );

const MONGODB_URI = 'mongodb+srv://hoon:hoonTest@cluster0.ipnka4b.mongodb.net/shop?retryWrites=true';

const app = express();
/**
 * - MongoDBStore 에 데이터 저장
 * @param { string } uri - 데이터를 저장할 데이터베이스 경로( 현재는 shop )
 * @param { string } collection - 데이터를 저장할 데이터베이스 컬렉션이름
 */
const store = new MongoDBStore( {
    uri : MONGODB_URI,
    collection : 'sessions'
} );
/** 세션에 CSRF 토큰 값을 설정하는 미들웨어 생성 */
const csrfProtection = csrf();

/** ejs 라이브러리를 view engine 으로 사용 */
app.set('view engine', 'ejs');
/** 서버에서 렌더링 할 뷰가 위치한 디렉토리 경로를 설정하는 역할 */
app.set('views', './views');

/**
 * - 내보낸 router 파일을 import
 */
const adminRoutes = require( './routes/admin.js' );
const shopRoutes = require( './routes/shop.js' );
const authRoutes = require( './routes/auth.js' );

/**
 * - 본문 해석 미들웨어
 *
 * - urlencoded 메서드는 내부에서 next 를 호출하여
 *
 * - 다음 라우팅 미들웨어를 실행하도록 해준다
 */
app.use( bodyParser.urlencoded({ extended : false } ) );
app.use( express.static( path.join( __dirname , 'public' ) ) );
/**
 * - 세션 설정
 * @param { string } secret - 식별 ID 를 Cookie 에 암호화( hash )해 등록할때 사용한다
 * @param { boolean } resave - 모든 요청마다 session 에 저장하는것이 아니라, session 이 변경되었을 경우에만,
 *                             저장하도록 한다 ( 성능 개선 )
 * @param { boolean } saveUninitialized - 저장할 필요가 없는 요청의 경우, 어떤 세션도 저장되지 않게 한다
 * @param { any } store? - 저장할 Store 객체 지정가능
 * @param { { [ key : string ] : any } } cookie? - 세션 쿠키를 설정할 수 있다
 */
app.use( session( {
    secret : 'my secret',
    resave : false,
    saveUninitialized : false,
    store
} ) );
/** CSRF 가 session 을 이용하기 때문에 session 다음에 미들웨어 등록 */
app.use( csrfProtection )
/** flash 미들웨어를 등록하여, request 객체에서 사용가능 */
app.use( flash() );

/** 실행되는 모든 요청에 대해 view 에 아래 필드를 추가해주는 미들웨어 */
app.use( ( req , res , next ) => {
    /** locals : express.js 에서 제공하는 렌더링할 view 에만 제공해주는 variable */
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
} );

app.use( ( req , res , next ) => {
    /** 세션에 user 가 저장되어 있지 않다면 request 에 user 를 저장하지 않음 */
    if (!req.session.user) {
        return next();
    }
    /**
     * - 모든 요청마다 session 에 저장된 user 를 이용해,
     *   user._id 를 이용하여 해당 사용자 데이터를 찾아 request 객체에 할당
     */
    User.findById( req.session.user._id )
        .then( user => {
            if ( !user ){
                return next();
            }
            /** 요청 객체에 User 를 저장하여 어디서든 접근하여 쓸 수 있도록 저장 */
            req.user = user;
            console.log( '<<Request : saveUserInfo success>>' )
            next();
        } )
        /** error 를 log 로 찍는것보단, Error 객체로 래핑하는것이 더 좋다 */
        .catch( err => {
            // console.log( '<<saveUserInfo Err>>' , err )
            next( new Error( err ) );
        } );
} );

app.use( '/admin' , adminRoutes );
app.use( shopRoutes );
app.use( authRoutes );

app.get( '/500' , errorController.get500 );

app.use( errorController.get404 );

/**
 * - error 처리 미들웨어( 4 개의 파라미터를 가진 미들웨어 )
 *
 * --> 제대로된 요청들은 전부 위에서 해결하기 때문에,
 *     해당 미들웨어에 도달하는 요청들은 전부 error 요청들이다
 *
 * --> 이곳에서 에러페이지로 리다이렉트시킨다
 */
app.use( ( error , req , res , next ) => {
    console.log( '<<Error redirect>>' , error );
    // res.redirect( '/500' );
    res.status( 500 ).render( '500' , {
        pageTitle : 'Error!',
        path : '/500',
        isAuthenticated :  req.session.isLoggedIn
    } );
} );

/** mongoose 가 mongoDB 와의 연결을 관리한다 */
mongoose
    /** shop 데이터베이스에 연결 */
    .connect( MONGODB_URI )
    .then( () => {
        console.log( "<<StartApp>>" );
        app.listen( 3000 );
    } )
    .catch( err => {
        console.log("<<StartApp Err>>", err);
    } );