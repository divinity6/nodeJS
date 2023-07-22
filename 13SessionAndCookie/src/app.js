const path = require("path");

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
/** mongoose 연결 */
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );

const errorController = require( './controllers/error' );
const User = require( './models/user' );

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
 * @param { { [ key : string ] : any } } cookie? - 세션 쿠키를 설정할 수 있다
 */
app.use( session( {
    secret : 'my secret',
    resave : false,
    saveUninitialized : false,
} ) );

app.use( ( req , res , next ) => {
    User.findById( '64b28d5af6522c01b9d0884d' )
        .then( user => {
            /** 요청 객체에 User 를 저장하여 어디서든 접근하여 쓸 수 있도록 저장 */
            req.user = user;
            console.log( '<<saveUserInfo success>>' )
            next();
        } )
        .catch( err => console.log( '<<saveUserInfo Err>>' , err ) );
} );

app.use( '/admin' , adminRoutes );
app.use( shopRoutes );
app.use( authRoutes );

app.use( errorController.get404 );

/** mongoose 가 mongoDB 와의 연결을 관리한다 */
mongoose
    /** shop 데이터베이스에 연결 */
    .connect( 'mongodb+srv://hoon:hoonTest@cluster0.ipnka4b.mongodb.net/shop?retryWrites=true' )
    .then( result => {
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

        console.log( "<<StartApp>>" );
        app.listen( 3000 );
    } )
    .catch( err => {
        console.log("<<StartApp Err>>", err);
    } );