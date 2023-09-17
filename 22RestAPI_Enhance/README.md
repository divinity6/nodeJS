## RestAPI_Enhance

- RestAPI 에서는 더이상 세션과 쿠키를 사용하지 않는다
  - RestAPI 원칙 중 하나인 각 요청을 따로다루는 원칙때문에 그렇다
  - 각 요청은 이전 요청과 독립적으로 검토되며, 클라이언트와 서버 사이에는 접점이 없다
  - 따라서, 세션을 검토하지 않는다
  - 클라이언트가 이전에 API 에 이전에 접속한적이 있는지 신경쓰지 않는다


- 따라서, 인증( Authentication )절차가 완전달라진다


- 프론트엔드는 간단한 React 코드를 이용해서 실행한다
  - validation 체크 로직은 같은 데이터를 전송하고 받더라도, 
  - 클라이언트, 서버 각각 독자적으로 실행해야 한다( 완전한 분리 )


---

### Mongoose Connect

- Mongoose 로 DB 를 다시 연결하는데, 이때 설정하는 Schema 에 timestamps 를 true 로 주게되면,


- 데이터베이스에 새로운 버전이나, 객체가 추가될때마다 Mongoose 가 timestamps 를 추가하게 된다
  - 따라서, 자동으로 createAt , updatedAt 등을 사용할 수 있다

````javascript
/** ===== models/post.js ===== */

const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

/**
 * - Schema 의 2 번째 인수로 Option 을 설정할 수 있다
 */
const postSchema = new Schema( {
    title : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    creator : {
        type : Object,
        required : String,
    }
} , { timestamps : true } );

/** 해당 Schema( 청사진 )에 기반한 model export */
module.exports = mongoose.model( 'Post' , postSchema );
````

- 참고로 Mongoose DB 에 연결할때는 아래와 같은 방식으로 연결할 수 있다
  - ( 생각안날 수 도 있으니깐... )


````javascript
/** ===== app.js ===== */
const mongoose = require( 'mongoose' );

mongoose
        .connect( `mongodb+srv://${ ID }:${ PW }@cluster0.ipnka4b.mongodb.net/${ DB_NAME }?retryWrites=true` )
        .then( () => {
          console.log( "<< StartWebApplication >>" );
          app.listen( 8080 );
        } )
        .catch( err => {
          console.log("<<StartApp Err>>", err);
        } );
````