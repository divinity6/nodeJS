const http = require( 'http' );

const express = require( 'express' );

const app = express();

/**
 * 서버생성시 꼭 필요
 *
 * - 이벤트 드리븐 아키텍쳐( EDA ) 방식
 * --> 이벤트를 기반으로 하는 아키텍처 설계방식
 *
 * @return { Server } server - 서벅 객체를 반환한다
 */
const server = http.createServer( app );

/**
 * @param { number } port - 해당 정보를 수신할 port
 */
server.listen( 3000 );