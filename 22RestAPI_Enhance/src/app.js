const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const feedRoutes = require( './routes/feed' );

const app = express();

/** application/json 형식을 파싱할때 사용하는 bodyParser 다 */
app.use( bodyParser.json() );

/** CORS 이슈를 해결하기 위해 header 에 교차출처 공유 설정 */
app.use( ( req , res , next ) => {

    /**
     * @param { 'Access-Control-Allow-Origin' } string - 특정 출처( 클라이언트 )에서 Origin 즉, 데이터에 액세스할 수 있도록 허용
     *                                                   ( 보통 * 를 이용하여 모든 도메인에서 접근가능하게 하지만,
     *                                                     특정 도메인 주소를 입력하여 제한할 수도 있다 )
     *                                                   다수의 도메인을 작성하려면 , 를 이용해 추가하면 된다
     */
    res.setHeader( 'Access-Control-Allow-Origin' , '*' );

    /**
     * @param { 'Access-Control-Allow-Methods' } string - 특정 출처( 클라이언트 )에서 Methods 즉, HTTP 메서드를 사용할 수 있도록 허용
     *                                                   ( 외부에서 사용하려는 HTTP 메서드를 , 를 이용해 추가해주면 된다 )
     *
     * - 출처에서 어떤 메서드가 허용되는지 알려줘야 한다
     */
    res.setHeader( 'Access-Control-Allow-Methods' , 'OPTIONS, GET, POST, PUT, PATCH, DELETE' );
    /**
     * @param { 'Access-Control-Allow-Headers' } string - 특정 출처( 클라이언트 )에서 Header 즉, HTTP Header 를 설정할 수 있도록 허용
     *                                                   ( * 를 이용하여 모든 헤더를 이용가능하게 하지만,
     *                                                     Content-Type , Authorization 은 반드시 허용해줘야한다 )
     *                                                   다수의 도메인을 작성하려면 , 를 이용해 추가하면 된다
     *
     * - 클라이언트가 헤더에 추가 인증 데이터를 포함한 요청을 보낼 수 있으며 , 컨텐츠 타입을 정의해서 보낼 수 있다
     */
    res.setHeader( 'Access-Control-Allow-Headers' , 'Content-Type, Authorization' );

    next();
} );

app.use( '/feed' , feedRoutes );

console.log( "<< StartWebApplication >>" );
app.listen( 8080 );