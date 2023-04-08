const http = require( 'http' );

const express = require( 'express' );

const app = express();

/**
 * - use 메서드를 사용하면,
 *
 * - express.js 에서 제공하는 다양한 미들웨어 함수들을 이용할 수 있다
 */
app.use( ( req , res , next )=> {
    console.log( 'In the middleware!!' );
    next(); // 다음 미들웨어 라인으로 이동
} );

app.use( ( req , res , next )=> {
    console.log( 'In another middleware!!' );
    res.send( '<h1>Hello from Express!</h1>' );
} );
/**
 * 서버생성시 꼭 필요
 *
 * - 이벤트 드리븐 아키텍쳐( EDA ) 방식
 * --> 이벤트를 기반으로 하는 아키텍처 설계방식
 *
 * @return { Server } se가rver - 서벅 객체를 반환한다
 */
const server = http.createServer( app );

/**
 * @param { number } port - 해당 정보를 수신할 port
 */
server.listen( 3000 );