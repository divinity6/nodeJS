const http = require( 'http' );
const fs = require( 'fs' );

/**
 * 서버생성시 꼭 필요
 *
 * - 이벤트 드리븐 아키텍쳐( EDA ) 방식
 * --> 이벤트를 기반으로 하는 아키텍처 설계방식
 *
 * @return { Server } server - 서벅 객체를 반환한다
 */
const server = http.createServer( ( req , res ) => {
    const url = req.url;
    const method = req.method;

    /** 최상위 도메인에 접속했을 경우 */
    if( '/' === url ){
        res.write( '<html>' );
        res.write( '<head><title>Enter Message</title></head>' );
        res.write( '<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Send</button></form></body>' );
        res.write( '</html>' );
        return res.end();
    }

    /** POST 요청으로 message path 에 도착했을 경우 */
    if ( '/message' === url && 'POST' === method ){

        const body = [];
        req.on( 'data' , ( chunk ) => {
            console.log( "data chunk" , chunk );
            body.push( chunk );
        } );

        req.on( 'end' , () => {
            /** 새로운 Buffer 가 생성되고 body 안에 있는 데이터가 추가된다 */
            const parseBody = Buffer.concat( body ).toString();
            console.log( "end parseBody" , parseBody );

            const message = parseBody.split( '=' )[ 1 ];
            /** 현재 서버 파일위치에 message.txt 파일 생성 */
            fs.writeFileSync( 'message.txt' , message );
        } );

        res.writeHead( 302 , {
            Location : '/'
        } );
        return res.end();
    }
    /** 응답유형 데이터 정보 */
    res.setHeader( 'Content-Type' , 'text/html' );
    res.write( '<html>' );
    res.write( '<head><title>My First Page</title></head>' );
    res.write( '<body><h1>Hello from my Node.js Server</h1></body>' );
    res.write( '</html>' );
    /** res 에 end 를 작성한 후에는 write 를 계속해서 작성할 수 없다 */
    res.end();
    // process.exit();
} );

/**
 * @param { number } port - 해당 정보를 수신할 port
 */
server.listen( 3000 );