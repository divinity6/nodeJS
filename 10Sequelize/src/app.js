const path = require("path");

const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const errorController = require( './controllers/error' );
const sequelize = require( './util/database' );

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

app.use( shopRoutes );

app.use( '/admin' , adminRoutes );

app.use( errorController.get404 );

sequelize.sync()
    .then( result => {
        // console.log( "result" , result );
        app.listen( 3000 );
    } )
    .catch( err => {
        console.log( "err" , err );
    } );

