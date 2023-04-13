const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const path = require("path");

const app = express();

/**
 * - 내보낸 router 파일을 import
 * @type {Router}
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

app.use( ( req , res , next ) => {
    res.status( 404 ).sendFile( path.join( __dirname , 'views' , '404.html' ) );
} );

/**
 * - express 내부에서 createServer 를 해서 서버를 만들어준다
 *
 * @param { number } port - 해당 정보를 수신할 port
 */
app.listen( 3000 );