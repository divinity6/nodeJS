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

- 그 후, 아래처럼 Post Model 을 생성해 DB 에 저장하고, 응답값을 받아올 수 있다


- 또한, DB 에 createdAt , updatedAt 필드가 생성된 것을 확인할 수 있다

````javascript
/** ===== controller/feed.js ===== */
const Post = require( '../models/post' );

/**
 * - 게시물을 생성하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.createPost = ( req , res , next ) => {
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post( {
    title ,
    content,
    imageUrl : 'images/hodu.png',
    creator : {
      name : 'Maximilian'
    },
  } );

  /** 해당 게시물을 DB 에 저장 */
  post.save()
          .then( result => {
            console.log( '<< createPost result >>' , result );
          } )
          .catch( err => {
            console.log( '<< createPost err >>' , err );
          } )
}
````

- 지금은 imageUrl 이 박혀있지만, 동적으로 제공하려면, images 폴더를 정적으로 제공해야 한다


- 따라서, images 폴더 경로, 즉 이미지가 저장된 파일 경로로 갈때는 express.static 메서드를 이용해 정적 파일들을 제공해주도록 한다

````javascript
/** ===== app.js ===== */
/** /images 경로로 라우팅할때는 정적으로 제공 */
app.use( '/images' , express.static( path.join( __dirname , 'images' ) ) );
````


- 또한, 현재 app 에서 error 처리를 할 경우, 비동기가 아닐 경우 error 를 throw 하고,


- 비동기일 경우에는 next 로 error 를 던지면, express.js 에서 제공하는 에러처리 미들웨어에서 catch 할 수 있다

````javascript
/** ===== controllers/feed.js ===== */
const { validationResult } = require( 'express-validator' );
/**
 * - 게시물을 생성하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.createPost = ( req , res , next ) => {
  const errors = validationResult( req );
    
  /** 동기식 코드일 경우 throw */
  if ( !errors.isEmpty() ){
    const error = new Error( 'Validation failed. entered data is incorrect.' );
    error.statusCode = 422;
    throw error;
  }

  /** 비동기식 코드일 경우 next */
  post.save()
          .then()
          .catch( err => {
            if ( !err.statusCode ){
              err.statusCode = 500;
            }
            next( err ); 
          } );
}
````

- 에러처리 미들웨어를 등록하지 않았다면, 아래처럼 에러처리 미들웨어를 등록해줄 수 있다
  - ( 파라미터 4개를 등록해주면 에러처리 미들웨어로 인식한다 )

````javascript
/** ===== app.js ===== */
/** 에러 처리 미들웨어 */
app.use( ( error , req , res , next ) => {
  console.log( '<< error >>' , error );
  const status = error.statusCode || 500;
  const message = error.message;

  res.status( status ).json( {  message } );
} );
````

---

- 단일 게시물을 가져올때, 동적 route 를 사용하는데, 해당 동적 route 는 


- route 에서 등록한 이름으로 params 객체에 매핑된다

````javascript
/** ===== routes/feed.js ===== */
// GET /post/:postId
router.get( '/post/:postId' , feedController.getPost );
````

- postId 가 req.params.postId 로 매핑된다

````javascript
/** ===== controllers/feed.js ===== */
/**
 * - 단일 게시물 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getPost = ( req , res , next ) => {
  const postId = req.params.postId;
}
````

- 그 후, 해당 파일을 찾아서 frontend 에 반환해주면 된다

````javascript
/** ===== controllers/feed.js ===== */
/**
 * - 단일 게시물 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getPost = ( req , res , next ) => {
  const postId = req.params.postId;
  Post.findById( postId )
          .then( post => {
            if ( !post ){
              const error = new Error( 'Could not find post.' );
              error.statusCode = 404;
              throw error;
            }
            res.status( 200 ).json( { message : 'Post fetched.' , post } );
          } )
          .catch( err => {
            if ( !err.statusCode ){
              err.statusCode = 500;
            }
            next( err );
          } );
}
````

---

### fileUpload

- 파일 업로드를 처리할때 사용하는 middleware 가 존재하는데 해당 multer 미들웨어를 사용한다


- 자세한 내용은 [ FileUploadDownload ]( https://github.com/divinity6/nodejs-study/tree/master/19FileUploadDownload ) 섹션에서 다뤘기 때문에 해당 항목을 참조하면 된다


- 단, fileStorage 에 저장할 때, 파일 이름을, 날짜 형식으로 저장하는 것이 아닌, uuid 를 이용하여 저장한다

````javascript

/** ===== app.js ===== */
const { v4: uuidv4 } = require( 'uuid' );

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
     * - 두번째 param - 파일 이름( uuid 를 이용하여 저장 )
     */
    callback( null , uuidv4() );
  }
} )
````

- 또한, Request 객체에서 파일 경로를 가져올 때, 


- multer 에서 req.file 객체에 서버의 파일 경로를 제공해준다

````javascript
/**
 * - 게시물을 생성하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.createPost = ( req , res , next ) => {
  /** 파일이 없을 경우 처리 */
  if ( !req.file ){
    const error = new Error( 'No image provided.' );
    error.statusCode = 422;
    throw error;
  }
  /** multer 에서 파일경로를 제공해준다 */
  const imageUrl = req.file.path;
}
````

- frontend 에서 파일을 업로드할 경우, 파일은 text 로 변환이 어렵다.
  - ( JSON 형식으로 보낼 경우 , text 형식으로 변환가능해야한다 )


- 따라서, frontend 에서 API 를 호출할때, Content-Type 을 application/json 형태로 보내지 않고,


- formData 형식( multipart/form-data )으로 보내야한다


- headers 를 생략하면 자동으로 formData 파일 형식으로 전송한다

````javascript
/** ========== frontend ========== */
/** ===== pages/Feed/Feed.js ===== */

/** JSON 형식이 아닌, formData 형식으로 제공한다 */
const formData = new FormData();
formData.append( 'title' , postData.title );
formData.append( 'content' , postData.content );
formData.append( 'image' , postData.image );

/** 서버측 어플리케이션에 컨텐츠 전송 */
fetch( 'http://localhost:8080/feed/post' , {
  method : 'POST',
  body : formData
} )
````