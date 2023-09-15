const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const feedRoutes = require( './routes/feed' );

const app = express();

/** application/json 형식을 파싱할때 사용하는 bodyParser 다 */
app.use( bodyParser.json() );

app.use( '/feed' , feedRoutes );

console.log( "<< StartWebApplication >>" );
app.listen( 8080 );