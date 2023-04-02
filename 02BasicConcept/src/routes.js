const fs = require( 'fs' );

/**
 * - handler 로 분리
 */
const requestHandler = ( req , res ) => {

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

        return req.on( 'end' , () => {
            /** 새로운 Buffer 가 생성되고 body 안에 있는 데이터가 추가된다 */
            const parseBody = Buffer.concat( body ).toString();
            console.log( "end parseBody" , parseBody );

            const message = parseBody.split( '=' )[ 1 ];
            /**
             * @name writeFileSync
             *
             *  - 현재 서버 파일위치에 message.txt 파일 생성
             *
             * --> writeFileSync 메서드에서 sync 는 동기화를 뜻한다
             *
             * --> 즉 async await 처럼, writeFile , 즉, file 이 생성되기전까지
             *     기다리는 메서드이다
             *
             * */
            // fs.writeFileSync( 'message.txt' , message );

            /**
             * @name writeFile
             *
             * - 반대로 writeFile 메서드는 callback 을 이용하여 파일처리가 끝난이후 시점을
             *   처리할 수 있다
             *
             * - 파라미터로 받는 값은 err 정보다
             */
            fs.writeFile( 'message.txt' , message , ( err ) => {
                res.writeHead( 302 , {
                    Location : '/'
                } );
                return res.end();
            });

        } );

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
};
/**
 * - 내보내기의 여러가지 방법
 */

// module.exports = requestHandler;

// module.exports = {
//     handler : requestHandler,
//     someText : 'Some hard coded test'
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded test';

exports.handler = requestHandler;
exports.someText = 'Some hard coded test';