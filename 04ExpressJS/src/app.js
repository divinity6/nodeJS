const express = require( 'express' );

const app = express();

/**
 * - 맨 위의 route 부터 처리
 */
app.use( '/' , ( req , res , next )=> {
    console.log( 'This always runs!' );
    next();
} )

/**
 * - add-product 요청을 위에 작성하는 이유는,
 *   요청이 파일 위에서부터 아래로 내려가고,
 *
 * - next() 를 호출하지 않으면, 다음 미들웨어로 넘어가지 않기 때문이다
 *
 * - 즉 add-product 경로를 만나면, 다음 use 를 실행하지 않는다!
 */
app.use( '/add-product' , ( req , res , next )=> {
    console.log( 'In another middleware!!' );
    res.send( '<h1>The Add Product Page!</h1>' );
} );

/**
 * - use 메서드를 사용하면,
 *
 * - express.js 에서 제공하는 다양한 미들웨어 함수들을 이용할 수 있다
 */
app.use( '/' , ( req , res , next )=> {
    console.log( 'In another middleware!!' );
    res.send( '<h1>Hello from Express!</h1>' );
} );

/**
 * - express 내부에서 createServer 를 해서 서버를 만들어준다
 *
 * @param { number } port - 해당 정보를 수신할 port
 */
app.listen( 3000 );