const path = require( 'path' );
const express = require( 'express' );
const { v4: uuidv4 } = require( 'uuid' );
const bodyParser = require( 'body-parser' );
const mongoose = require( 'mongoose' );
const multer = require( 'multer' );

const { graphqlHTTP } = require( 'express-graphql' );
const graphqlSchema = require( './graphql/schema' );
const graphqlResolver = require( './graphql/resolvers' );
const auth = require( './middleware/auth' );

const privateKeys = require( './utils/privateKeys' );

const app = express();

/** 파일을 어디에 설정할지 설정 */
const fileStorage = multer.diskStorage( {
    /** multer 에서 처리한 파일을 저장할 위치 */
    destination : ( req , file , callback ) => {
        /**
         * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
         *
         * - 두번째 param - 파일을 저장할 경로
         */
        callback( null , path.join( __dirname , 'images' ) );
    },
    /** multer 에서 처리한 파일의 파일이름 */
    filename : ( req , file , callback ) => {
        /**
         * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
         *
         * - 두번째 param - 파일 이름
         */
        callback( null , `${ uuidv4() }-${ file.originalname }` );
    }
} );

const fileFilter = ( req , file , callback ) => {
    /**
     * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
     *
     * - 두번째 param - 해당 파일을 저장할지 여부
     */
    if ( 'image/png' === file.mimetype ||
        'image/jpg' === file.mimetype ||
        'image/jpeg' === file.mimetype ){
        callback( null , true );
    }
    else {
        callback( null , false );
    }
}

/** application/json 형식을 파싱할때 사용하는 bodyParser 다 */
app.use( bodyParser.json() );

/** image body 필드값을 가져온다 */
app.use( multer( { storage : fileStorage , fileFilter } ).single( 'image' ) );

/** /images 경로로 라우팅할때는 정적으로 제공 */
app.use( '/images' , express.static( path.join( __dirname , 'images' ) ) );

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

    /** GraphQL 사용시, OPTIONS 로 URI 체크시 유효한 응답을 반환하도록 설정 */
    if ( 'OPTIONS' === req.method ){
        return res.sendStatus( 200 );
    }

    next();
} );

/** GraphQL 동작전 token 체크 미들웨어에서 먼저 체크 */
app.use( auth );

/** post 요청으로 제한하지않고 모든 middleware 타입으로 넘겨준다 */
app.use( '/graphql' , graphqlHTTP( {
    schema : graphqlSchema,
    rootValue : graphqlResolver,
    graphiql : true,        // graphiql 툴 사용 http://localhost:8080/graphql 로 접근하여 테스트 할 수 있다
    customFormatErrorFn( err ){
        console.log( '<< err >>' , err )
        /**
         * - originalError 에는 graphQL 외에서 발생한 error 객체가 들어간다
         *
         * - 즉, graphql query 에 글자가 누락되는 등의 error 가 발생하면,
         *   originalError 에 추가되지 않는다
         */
        if ( !err.originalError ){
            return err;
        }

        const data = err.originalError.data;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;

        /** 원하는 error 객체를 생성해서 반환할 수 있다 */
        return {
            message,
            status : code,
            data
        }
    }
} ) );

/** 에러 처리 미들웨어 */
app.use( ( error , req , res , next ) => {
    console.log( '<< error >>' , error );
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status( status ).json( {  message , data } );
} );

mongoose
    .connect( privateKeys.MONGODB_URI )
    .then( () => {
        app.listen( 8080 );
        console.log( "<< StartWebApplication >>" );
    } )
    .catch( err => {
        console.log("<<StartApp Err>>", err);
    } );