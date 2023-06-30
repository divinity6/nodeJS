const path = require("path");

const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const errorController = require( './controllers/error' );

/** mongoDB 연결 */
const mongoConnect = require( './util/database' ).mongoConnect;

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
//
// const shopRoutes = require( './routes/shop.js' );

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
    // User.findByPk( 1 )
    //     .then( user => {
    //
    //         /**
    //          * - 요청 객체에 사용자 정보 sequelize 객체 저장하여
    //          *   어디서든 접근하여 쓸 수 있도록 수정
    //          */
    //         req.user = user;
    //         next();
    //     } )
    //     .catch( err => console.log( '<<findUserErr>>' , err ) );
    next();
} );

// app.use( shopRoutes );
//
app.use( '/admin' , adminRoutes );

app.use( errorController.get404 );

mongoConnect( () => {
    console.log( "<<StartApp>>" );
    app.listen( 3000 );
} );