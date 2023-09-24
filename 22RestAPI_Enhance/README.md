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
    callback( null , `${ uuidv4() }-${ file.originalname }` );
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
  /** 
   * - multer 에서 파일경로를 제공해준다 
   *   ( destination 설정에서 fullPath 로 입력했기 때문에, 도메인 경로부터 붙여야 한다 )
   * */
  // const imageUrl = req.file.path;
    
  /** 절대 경로로 저장했기 때문에 split 으로 잘라서 도메인 위치부터 불러와야 한다 */
  const fullPath = req.file.path.split( '/' );
  const imageUrl = `${ fullPath[ fullPath.length - 2 ] }/${ fullPath[ fullPath.length - 1 ] }`;
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

---

### Update Post

- 게시물을 업데이트할때는, 기존 게시물을 덮어씌워야하기 때문에 put 메서드를 이용하는 것이 좋다
  - 일반 html 에서는 요청을 보낼 수 없지만, JS 를 이용하여 요청을 보낼 수 있다
  - put 요청은 post 요청처럼 요청 본문이 존재한다

````javascript
/** ===== routes/feed.js ===== */
const { body } = require( 'express-validator' );

// PUT /post/:postId
router.put( '/post/:postId' , [
  /** post validation logic */
  body( 'title' ).trim().isLength( { min : 5 } ),
  body( 'content' ).trim().isLength( { min : 5 } )
] , feedController.updatePost );
````

- 또한, 게시물을 업데이트할때는, 이미지를 새로 추가하거나, 기존 이미지를 그대로 사용할 수 있다


- 따라서, 기존 이미지를 그대로 사용할지, 아니면 이미지를 새로 추가했는지를 검증해야한다

````javascript
/** ===== controllers/feed.js ===== */

/**
 * - 단일 게시물 업데이트 Controller
 * @param req
 * @param res
 * @param next
 */
exports.updatePost = ( req , res , next ) => {

  /**
   * - image 를 새로추가했을 경우에는, 새로 추가하고,
   *   그렇지 않을 경우에는 기존 image 을 사용한다
   */
  let imageUrl = req.body.image;
  if ( req.file ){
    const fullPath = req.file.path.split( '/' );
    imageUrl = `${ fullPath[ fullPath.length - 2 ] }/${ fullPath[ fullPath.length - 1 ] }`;
  }
}
````

- 게시물을 업데이트할때는, 이미지를 업데이트하는지 체크해야한다.


- 이미지를 업데이트한다면, 이전에 가지고 있던 이미지 경로를 찾아 해당 이미지를 제거한 후,


- 새로운 이미지 경로로 대체해 주어야한다

````javascript
/** ===== controllers/feed.js ===== */
const Post = require( '../models/post' );
/**
 * - 단일 게시물 업데이트 Controller
 * @param req
 * @param res
 * @param next
 */
exports.updatePost = ( req , res , next ) => {
  const errors = validationResult( req );

  /** 유효성 검사 실패 코드 */
  if ( !errors.isEmpty() ){
    const error = new Error( 'Validation failed. entered data is incorrect.' );
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  /**
   * - image 를 새로추가했을 경우에는, 새로 추가하고,
   *   그렇지 않을 경우에는 기존 imageUrl 을 사용한다
   */
  let imageUrl = req.body.image;
  if ( req.file ){
    const fullPath = req.file.path.split( '/' );
    imageUrl = `${ fullPath[ fullPath.length - 2 ] }/${ fullPath[ fullPath.length - 1 ] }`;
  }

  /** imageUrl 자체가 존재하지 않을경우에는 에러 처리 */
  if ( !imageUrl ){
    const error = new Error( 'No file picked.' );
    error.statusCode = 422;
    throw error;
  }

  /** 에러가 없을 경우에는 DB 에 업데이트 */
  Post.findById( postId )
          .then( post => {
            if ( !post ){
              const error = new Error( 'Could not find post.' );
              error.statusCode = 404;
              throw error;
            }

            /** imageUrl 이 업데이트 되었다면, 이전 Image 를 제거 */
            if ( imageUrl !== post.imageUrl ){
              clearImage( post.imageUrl );
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.conent = content;
            return post.save();
          } )
          .then( result => {
            res.status( 200 ).json( { message : 'Post updated!.' , post : result } );
          } )
          .catch( err => {
            if ( !err.statusCode ){
              err.statusCode = 500;
            }
            next( err );
          } );
}

/**
 * - Image 삭제 헬퍼함수
 *
 * @param filePath
 */
const clearImage = filePath => {
  /** 현재 path 에서 한단계 상위로 올라가서 */
  filePath = path.join( __dirname , '..' , filePath );
  /** 파일을 삭제하고, 오류 로그를 남긴다 */
  fs.unlink( filePath , err => {
    console.log( '<< image delete error >>' , err );
  } )
};
````

---

### DeletePost

- 게시물을 제거할때는 delete HTTP 메서드를 이용하는것이 좋다

````javascript
/** ===== routes/feed.js ===== */

// DELETE /post/:postId
router.delete( '/post/:postId' , feedController.deletePost );
````

- 또한, 게시물을 곧바로 삭제하지 않고, 해당 게시물이 존재하는지 먼저 DB 에서 체크한다음, 


- 해당 게시물이 존재할 경우, 삭제하는 로직이 안정적이다


- 그리고, 사용하는 image 나 파일들도 잊지 않고 제거해주어야 깔끔하게 처리할 수 있다

````javascript
/** ===== controllers/feed.js ===== */
const Post = require( '../models/post' );
/**
 * - 단일 게시물 삭제 Controller
 * @param req
 * @param res
 * @param next
 */
exports.deletePost = ( req , res , next ) => {
  const postId = req.params.postId;
  /** 해당 게시물이 존재하는지 체크 */
  Post.findById( postId )
          .then( post => {
            if ( !post ){
              const error = new Error( 'Could not find post.' );
              error.statusCode = 404;
              throw error;
            }

            // Check logged in user
            
            /** 사용하는 이미지 제거 */
            clearImage( post.imageUrl );

            /** 존재할 경우 DB 에서 제거 */
            return Post.findByIdAndRemove( postId );
          } )
          .then( result => {
            console.log( '<< Delete Post >>' , result );
            res.status( 200 ).json( { message : 'Deleted post.' } );
          } )
          .catch( err => {
            if ( !err.statusCode ){
              err.statusCode = 500;
            }
            next( err );
          } );
}

/**
 * - Image 삭제 헬퍼함수
 *
 * @param filePath
 */
const clearImage = filePath => {
  /** 현재 path 에서 한단계 상위로 올라가서 */
  filePath = path.join( __dirname , '..' , filePath );
  /** 파일을 삭제하고, 오류 로그를 남긴다 */
  fs.unlink( filePath , err => {
    console.log( '<< image delete error >>' , err );
  } )
};
````

---

### Pagination

- frontend 에서 query 값으로 현재 페이지 정보를 보내면,
  - ( 실제 query 로 보내는 것이 아니라, backend-api 쿼리로 보내는 방법도 있다 )


- backend 에서는 ( 현재 페이지 - 1 ) * 보여줄 수 를 계산한다음


- 해당 값만큼 건너뛰고, 보여줄 수 만큼 DB 에서 제품을 가져와 반환하면 된다


- 자세한 내용은 [ Pagination ]( https://github.com/divinity6/nodejs-study/tree/master/20Pagination ) 을 참고하면 된다


````javascript
/** ===== controllers/feed.js ===== */
const Post = require( '../models/post' );
/**
 * - 게시물 목록을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = ( req , res , next ) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  /** 전체 Post 를 가지고 온후, 전체 갯수를 반환함 */
  Post.find().countDocuments()
          .then( count => {
            totalItems = count;

            return Post.find()
                    /**
                     * - skip 메서드를 추가하면,
                     *   find 로 찾은 결과중 첫 번째부터 skip 갯수만큼 생략한다
                     */
                    .skip( ( currentPage - 1 ) * perPage )
                    /**
                     * - limit 메서드는 find 로 가져오는 데이터양을 지정할 수 있다
                     */
                    .limit( perPage )
          } )
          /** 모든 Posts 를 찾아 반환 */
          .then( posts => {
            res.status( 200 ).json( {
              message : 'Fetched posts successfully.',
              posts ,
              totalItems
            } );
          } )
          .catch( err => {
            if ( !err.statusCode ){
              err.statusCode = 500;
            }
            next( err );
          } );
};

````

---

### Signup 

- 회원가입을 구현하려면 사용자관련 Model 을 정의한다


- 사용자들은 게시물들을 가지고 있으므로, 게시물들을 연결하고, ID 를 저장한다

````javascript
/** ===== models/user.js ===== */
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const userSchema = new Schema( {
  email : {
    type : String,
    require : true,
  },
  password : {
    type : String,
    require : true
  },
  name : {
    type : String,
    require : true,
  },
  status : {
    type : String,
    require : true,
  },
  posts : [
    {
      /** ObjectId 타입으로 정의 */
      type : Schema.Types.ObjectId,
      /**
       * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
       *
       * --> 참조할 model 의 이름을 사용하면 된다
       */
      ref : 'Post'
    }
  ]
} );

module.exports = mongoose.model( 'User' , userSchema );
````

- 그 후, Route 를 연결하고( 회원가입시 데이터를 입력하기 때문에 PUT 메서드를 사용하는 것을 추천한다 )


- 또한, 회원가입 Controller 에서 로직을 처리하기전에 DB 에서 해당 회원이 존재하는지 체크하는 validator 를 router 에 추가한다
 
````javascript
/** ===== routes/auth.js ===== */
const express = require( 'express' );
const { body } = require( 'express-validator' );

const User = require( '../models/user' );

const router = express.Router();

const authController = require( '../controllers/auth' );

/** 회원가입시 새로운 데이터를 입력하거나 덮어씌우기 때문에 PUT 을 사용한다 */
// GET /auth/signup
router.put( '/signup' , [
  /** auth validation logic */
  body( 'email' )
          .isEmail()
          .withMessage( 'Please enter a valid email.' )
          /**
           * - 사용자지정 custom 에러 생성가능
           * --> 즉, email 뿐만 아니라, 특정 에러등도 커스텀해 추가할 수 있다
           *
           * - 즉, 사용자 검증자를 추가할 수 있다
           *
           * - custom validator 는 true , false ,error ,promise 객체를 반환할 수 있다
           */
          .custom( ( value , { req } ) => {
            /** email 과 일치하는 사용자를 찾는다 */
            return User.findOne( { email : value } )
                    .then( userDoc => {
                      /**
                       * - 해당 email 을 가진 사용자가 있다면,
                       *   해당 사용자를 생성하지 말아야 한다
                       */
                      if (userDoc) {
                        return Promise.reject( 'E-Mail exists already exists!' );
                      }
                    } );
          } )
          .normalizeEmail(),

  /**
   * - 들어온 요청의 body 의 password 필드는,
   *
   * - 반드시 5 문자열 이상( isLength )이어야한다
   */
  body( 'password' ).trim().isLength( { min : 5 } ),
  /** 이름이 비어있지 않은지 체크 */
  body( 'name' ).trim().not().isEmpty(),
] , authController.signup );

module.exports = router;
````

- Controller 를 연결할때, validation 체크를 통과하면, 데이터베이스에 저장하고,


- validation 체크를 통과하지 못하면, error middleware 로 튕겨낸다


- DB 에 데이터를 저장할때, pw 의 경우에는 hash 화하여 저장해야한다
  - 보안때문에 일반텍스트로 저장되지 않게 하기 위함
  - 그렇기 때문에 bcryptjs 를 사용하여 hash 화한다


- 일반 설치

````shell
npm i bcryptjs
````

- workpsaces 사용시

````shell
npm i bcryptjs --workspace=${ WORKSPACE_NAME }
````

- hash 화 하여 저장한후, 응답 값을 받으면 그 값을 frontend 로 반환한다

````javascript
/** ===== controllers/auth.js ===== */

/**
 * - 회원 가입 Controller
 * @param req
 * @param res
 * @param next
 */
exports.signup = ( req , res , next ) => {
  const errors = validationResult( req );
  /** route validation 에서 체크한 에러가 존재할 경우 */
  if ( !errors.isEmpty() ){
    const error = new Error( 'Validation failed.' );
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email , name , password } = req.body;

  /**
   * - hash 화 하고싶은 문자열을 첫 번째 인자로 넘겨준다
   *
   * - 두 번째는 몇 차례의 해싱을 적용할 것인지 지정한다
   *   ( 솔트 값이 높을수록 오래걸리지만, 더 안전하다 )
   *
   * - 12 정도면 높은 보안성능으로 간주된다
   *
   * @return { Promise<string> } - 비동기 해쉬 string 값을 반환한다
   */
  bcrypt.hash( password , 12 )
          /** password 를 암호화하고 저장한 후, 응답 값 반환 */
          .then( hashedPw => {
            const user = new User( {
              email ,
              password : hashedPw,
              name
            } );

            return user.save();
          } )
          .then( result => {
            res.status( 201 ).json( { message : 'User created!' , userId : result._id } );
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

### RestAPI Authentication

- 클라이언트는 서버에 인증 데이터로 이메일과 비밀번호를 보낸다


- 일반적인 서버는 데이터가 유효하다면 세션을 설정하고 브라우저에 쿠키에 저장시켰다


- 하지만, REST API 는 상태성이 없기 때문에, 세션을 사용하지 않는다
  - ( 클라이언트를 고려하지 않는다는 뜻이다 )
  - 서버와 클라이언트가 엄격하게 분리되어, 모든 요청이 독립적으로 처리된다


- REST API 는 데이터가 유효하다면, 토큰을 클라이언트에 전달한다
  - 서버에서 생성되는 토큰은 서버만 인증할 수 있는 정보를 가지고 있으며, 클라이언트에 저장한다


- 그 후, 클라이언트가 서버에 보내는 요청에 토큰을 부착하면, 인증이 필요한 모든 요청에 저장된 토큰이 부착된다
  - 토큰을 생성한 서버만이 해당 토큰을 검증할 수 있다
  - 만약, 프론트엔드에서 토큰을 변경하거나 인증여부를 조작한다면, 서버에서 체크한다
  - 토큰은 ( JSON Data ) 와 무작위 서명( Signature )를 hash 화해 JWT( JSON Web Token ) 이 된다
  - 따라서, 클라이언트에서 토큰을 생성하거나, 수정할 수 없다

---

### Login

- 어짜피, 이메일-비밀번호 조합을 체크해야하기 때문에, Login Route 에서 Validation 체크를 진행하지 않고, Controller 에서 진행한다

````javascript
/** ===== routes/auth.js ===== */
/**
 * 로그인시 이메일 , 비밀번호 유효성 검사를 진행할 수도 있지만,
 * 어짜피 이메일-비밀번호 조합을 체크해야하기 때문에 바로 Controller 에서 진행한다
 */
// POST /auth/login
router.post( '/login' , authController.login )
````

- Controller 에서 입력한 email 로 해당 user 를 찾고, 사용자가 보낸 비밀번호와 DB 의 비밀번호가 같은지 체크한다


- 비밀번호까지 일치한다면 JWT( JSON Web Token )을 생성한다

````javascript
/** ===== controllers/auth.js ===== */
/**
 * - 로그인 Controller
 * @param req
 * @param res
 * @param next
 */
exports.login = ( req , res , next ) => {
  const { email , password } = req.body;
  let loadedUser;

  /** 해당 email 이 존재하는지 체크 */
  User.findOne( { email } )
          .then( user => {
            /** DB 에 해당 User 가 존재하지 않는다면 에러처리 */
            if ( !user ) {
              const error = new Error( 'A user with this email could not be found.' );
              error.statusCode = 401;
              throw error;
            }
            loadedUser = user;

            /** 사용자의 password 와 DB password 를 검사한다 */
            return bcrypt.compare( password , user.password )
          } )
          .then( isEqual => {
            /** 사용자가 비밀번호를 잘못 입력했을 경우 */
            if ( !isEqual ){
              const error = new Error( 'A user with this email could not be found.' );
              error.statusCode = 401;
              throw error;
            }
            /** 비밀번호 까지 맞다면 JWT( JSON Web Token )생성 */
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

### JWT( JSON Web Token )

- 사용자 자격증명시, JWT 를 이용해 자격증명을 할 수 있다


- nodeJS 에서는 JWT 토큰을 이용할때 jsonwebtoken 이라는 라이브러리를 이용한다

````shell
npm install --save jsonwebtoken
````

- 인증시에 , jsonwebtoken 를 이용하여, 이메일 사용자아이디등등을 이용하여 토큰을 생성하게 되는데,
  - 토큰 생성시 privateKey 를 포함하여 난수화한다
  - ( 프론트엔드에서 해당 토큰을 가지고 있기때문에, 복잡한 해싱 과정을 거친다 )


- 또한, 토큰이 탈취 및 도용당할것을 대비해서 토큰의 유효기간을 설정할 수 있다

````javascript
/** ===== controllers/auth.js ===== */
/**
 * - 로그인 Controller
 * @param req
 * @param res
 * @param next
 */
exports.login = ( req , res , next ) => {
    const { email , password } = req.body;
    let loadedUser;

    /** 해당 email 이 존재하는지 체크 */
    User.findOne( { email } )
        .then( user => {
            /** DB 에 해당 User 가 존재하지 않는다면 에러처리 */
            if ( !user ) {
                const error = new Error( 'A user with this email could not be found.' );
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;

            /** 사용자의 password 와 DB password 를 검사한다 */
            return bcrypt.compare( password , user.password )
        } )
        .then( isEqual => {
            /** 사용자가 비밀번호를 잘못 입력했을 경우 */
            if ( !isEqual ){
                const error = new Error( 'A user with this email could not be found.' );
                error.statusCode = 401;
                throw error;
            }
            /** 비밀번호 까지 맞다면 JWT( JSON Web Token )생성 */

            /**
             * - sign 메서드를 이용해 새로운 서명( 시그니처 )생성
             *
             * @param { any } payload - 토큰에 이메일, 사용자 아이디등등
             *   ( 그러나, 비밀번호를 포함하는것은 보안상 좋지 않다 )
             *
             * @param { string } secretOrPrivateKey - 서명에 사용할 private key 를 사용한다
             *                                        ( 이 값을 이용해 난수화해서 해독할 수 없게한다 )
             *
             * @param { any } options - 유효기간등 옵션을 설정할 수 있다
             *                          ( expiresIn : '1h' => 1시간 유효 )
             */
            const token = jwt.sign( {
                email : loadedUser.email,
                userId : loadedUser._id.toString(),
            } ,
                'somesupersecretsecret' , {
                expiresIn : '1h'
            } );

            /** 토큰값과 사용자 id 를 반환 */
            res.status( 200 ).json( { token , userId : loadedUser._id.toString() } );
        } )
        .catch( err => {
            if ( !err.statusCode ){
                err.statusCode = 500;
            }
            next( err );
        } );
}
````

- https://jwt.io/ 에 접속하여 토큰을 검증해볼 수 있는데, 


- 제작한 토큰을 입력하면 해당 사이트에서 자동으로 해석해준다


- 어짜피, 이렇게 해석해도, 해당 토큰의 데이터를 수정하면 서버의 토큰과 다르기 때문에 의미가 없다

---

### Block

- 들어오는 요청에 JWT 토큰이 부착되어 있지 않다면, 요청을 차단해야하기에, 모든 요청을 검사하는 미들웨어를 추가한다


- frontend 에서 JWT 토큰을 요청에 부착할때, header, body 둘 중 하나에 부착할 수 있는데, body 보단 header 에 부착하는것이 좋다
  - 왜냐하면, GET 요청등 body 가 없는 요청등에서 인증이 필요할 수 있는데 이때는 요청 본문이 없기 때문이다
  - 또한, header 중 query 에 입력할 수 도 있지만, 헤더 Authorization 필드에 추가하는것이 좋다
  - ( 공식정인 인증정보를 추가필드 )
  - 요청을 보낼때 Authorization 값으로 Bearer 를 prefix 로 붙여준다
  - ( 토큰의 유형을 구분할때 사용하는데 Bearer Token 은 인증 토큰과 같고, 보통 JWT 에 사용한다 )

  
````javascript
/** ========== frontend ========== */
/** ===== pages/Feed/Feed.js ===== */

loadPosts = direction => {
  fetch(`http://localhost:8080/feed/posts?page=${ page }`, {
    headers : {
      /** header 에 인증 토큰 부착 */
      Authorization : `Bearer ${ this.props.token }`
    }
  } ) 
}

````

- 또한 Authorization 헤더를 이용하려면, backend 에서 해당 header 를 반드시 활성화 시켜줘야 한다

````javascript
/** ===== app.js ===== */

/** CORS 이슈를 해결하기 위해 header 에 교차출처 공유 설정 */
app.use( ( req , res , next ) => {
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
````

- JWT 를 이용하여 서버에 데이터를 전송하게 되면, 서버에서는 JWT 토큰을 해석하여


- 인증 여부를 체크하고, 요청에 분석한 userId 등의 정보를 부착하여 다른 route 들에서 사용할 수 있도록 해야한다


- 따라서, 해당 토큰 분석 및 req 부착기능을 middleware 로 분리하여 공통적으로 처리하도록 한다 

````javascript
/** ===== middleware/is-auth.js ===== */

const jwt = require( 'jsonwebtoken' );

/**
 * - JSON Web Token 인증 미들웨어
 * @param req
 * @param res
 * @param next
 */
module.exports = ( req , res , next ) => {
    const authHeader = req.get( 'Authorization' );

    /** 인증헤더를 부착하지 않았을 경우 */
    if ( !authHeader ){
        const error = new Error( 'Not authenticated.' );
        error.statusCode = 401;
        throw error;
    }

    /** Authorization 헤더 반환 Bearer 부분을 잘라서 사용 */
    const [ _ , token ] = authHeader.split( ' ' );
    let decodedToken;
    try {
        /**
         * - verify() 메서드는 토큰을 해석할뿐만 아니라, 체크하는 과정도 거친다
         *
         * - decoded 메서드도 존재하지만, 해독만하지, 유효한지는 체크하지 않기 때문에
         *   반드시 verify 메서드를 사용한다
         *
         * --> verify 메서드는 토큰과 비공개 인증키를 함께 넣어줘야한다
         */
        decodedToken = jwt.verify( token , 'somesupersecretsecret' );
    }
    catch ( err ){
        /** error 핸들러에서 처리 */
        err.statusCode = 500;
        throw err;
    }

    /** 해독은 잘되었지만, 토큰이 유효하지 않을 경우 */
    if ( !decodedToken ){
        const error = new Error( 'Not authenticated.' );
        error.statusCode = 401;
        throw error;
    }

    /** 인증이 되었다면 해당 토큰의 userId 를 요청에 부착하여 사용 */
    req.userId = decodedToken.userId;
    console.log( '<< JWT Auth UserId>>' , req.userId );
    next();
}
````

- 인증이 필요한 모든 route 등에 부착

````javascript
/** ===== routes/feed.js ===== */

const feedController = require( '../controllers/feed' );
const isAuth = require( '../middleware/is-auth' );

const router = express.Router();

/** 인증이 필요한 모든 route 들에 부착 */

// GET /feed/posts
router.get( '/posts' , isAuth , feedController.getPosts );
````

- 당연하지만, 이렇게 JWT 인증을 추가했으면 인증이 필요한 모든 frontend 요청에 인증 헤더를 추가해줘야한다

````javascript
/** ========== frontend ========== */
/** ===== pages/Feed/Feed.js ===== */
/** 프론트엔드 게시물 삭제 요청 */
fetch(`http://localhost:8080/feed/post/${ postId }` , {
      method : 'DELETE',
      headers : {
        Authorization : `Bearer ${ this.props.token }`
      }
    })
````

---

### Connect Post

- 이제 게시물을 생성한 User 와 Post 를 연결한다


- 이때, Post Model 과 User Model 을 연결하는데, 


- Schema 의 ObjectId 를 설정하여 두 테이블간의 관계를 설정할 수 있다

````javascript
/** ===== models/post.js ===== */
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

/**
 * - Schema 의 2 번째 인수로 Option 을 설정할 수 있다
 */
const postSchema = new Schema({
  /** 사용자와 게시물의 관계 설정 */
  creator : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : true,
  }
} );

/** 해당 Schema( 청사진 )에 기반한 model export */
module.exports = mongoose.model( 'Post' , postSchema );
````

- 이렇게 User 테이블과 Post 테이블간의 관계를 설정하여 서로를 참조할 수 있도록 한다

````javascript
/** ===== models/post.js ===== */
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const userSchema = new Schema( {
  posts : [
    {
      /** ObjectId 타입으로 정의 */
      type : Schema.Types.ObjectId,
      /**
       * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
       *
       * --> 참조할 model 의 이름을 사용하면 된다
       */
      ref : 'Post'
    }
  ] 
} );

/** 해당 Schema( 청사진 )에 기반한 model export */
module.exports = mongoose.model( 'User' , userSchema );
````

- 그 후, 새로운 게시물을 생성하는 controller 에서 게시물을 생성하고 post 테이블만 업데이트 해주는 것이 아니라,


- 사용자 table 또한 Post 리스트들을 들고 있기 때문에, 사용자 Post 리스트도 업데이트해준다

````javascript
/** ===== controllers/feed.js ===== */

/**
 * - 게시물을 생성하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.createPost = ( req , res , next ) => {
  const post = new Post( {
    title ,
    content,
    imageUrl,
    /** 인증 미들웨어에서 설정한 userId 사용 */
    creator : req.userId,
  } );

  /** 해당 게시물을 DB 에 저장 */
  post.save()
    /** 여기에서 찾은 User 는 현재 로그인 중인 사용자다 */
    .then( result => {
      return User.findById( req.userId );
    } )
    .then( user => {
      creator = user;

      /** 해당 사용자의 posts 목록도 업데이트 해준다 */
      user.posts.push( post );

      return user.save();
    } )
    .then( result => {
      /**
       * 상태코드 201 은 게시물을 생성했다는 알림을 명시적으로 보내는 것이다
       * ( 반면 200 은 단지 성공했다는 알림만 보낸다 )
       */
      res.status( 201 ).json( {
        message : 'Post created successfully!',
        post,
        creator : {
          _id : creator._id,
          name : creator.name
        }
      } );
    } )
    .catch( err => {
      if ( !err.statusCode ){
        err.statusCode = 500;
      }
      next( err );
    } );
}
````

- 즉, 이렇게 테이블간의 관계설정을 해두고, 서로 테이블간의 id 만 참조하도록 한다

---

### UpdateDelete Post


- 해당 게시물을 제거하거나 업데이트 하기전에 해당 사용자인지 체크하는 로직을 추가해줘야 인증이 마무리된다


- 또한 게시물을 제거할때는, 해당 게시물을 가지고 있는 테이블의 컬렉션또한 업데이트를 해줘야한다
  - 예를 들어, user 테이블은 현재 post 테이블의 id 들을 가지고 있기 때문에 이 데이터 또한 제거해줘야한다


````javascript
/** ===== controllers/feed.js ===== */

/**
 * - 단일 게시물 삭제 Controller
 * @param req
 * @param res
 * @param next
 */
exports.deletePost = ( req , res , next ) => {
  const postId = req.params.postId;
  /** 해당 게시물이 존재하는지 체크 */
  Post.findById( postId )
    .then( post => {
      if ( !post ){
        const error = new Error( 'Could not find post.' );
        error.statusCode = 404;
        throw error;
      }

      /** 해당 Post 의 생성자가 현재 User 와 같은지 체크( 자기자신이 만든 게시물인지 체크 ) */
      if ( post.creator.toString() !== req.userId ){
        const error = new Error( 'Not authorized!' );
        error.statusCode = 403;
        throw error;
      }

      // Check logged in user
      clearImage( post.imageUrl );

      /** 존재할 경우 DB 에서 제거 */
      return Post.findByIdAndRemove( postId );
    } )
    /** 사용자 테이블에서도 삭제 */
    .then( result => {
      console.log( '<< Delete Post >>' , result );
      return User.findById( req.userId );
    } )
    .then( user => {
      /**
       * - Mongoose 에서 제공하는 pull 메서드를 사용하면,
       *   삭제하려는 게시물의 ID 를 전달하면 리스트에서 삭제해준다
       * */
      user.posts.pull( postId );
      return user.save();
    } )
    .then( result => {
      res.status( 200 ).json( { message : 'Deleted post.' } );
    } )
    .catch( err => {
      if ( !err.statusCode ){
        err.statusCode = 500;
      }
      next( err );
    } );
}
````

- 결론적으로, 각 요청들이 독립적으로 처리되기때문에, 세션을 사용하지 않고, JSON Web Token 을 사용한다

---

### Async Await 적용

- async await 도 내부 소스코드를 살펴보면 .then() 메서드를 이용하여 구현되어 있다


- 또한, 최상위 레벨에서( 함수내부에서가 아닌 ) async 없이 프로미스를 await 할 수 있다


- 지금 작업물에서 getPosts 컨트롤러에서는 creator 필드( User 테이블의 )를 채워오지 않았었는데,


- 해당 필드는 User 테이블이 가지고 있다. 단지, Post 테이블은 User 테이블을 참조만하고 있기 때문에,


- populate 메서드를 이용하여 해당 필드를 채워서 가져올 수 있다

````javascript
/** ========== async await 적용 ========== */
/** ===== controllers/feed.js ===== */
/**
 * - 게시물 목록을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = async ( req , res , next ) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;

    try {
        /** 전체 Post 를 가지고 온후, 전체 갯수를 반환함 */
        const totalItems = await Post.find().countDocuments();

        /** 모든 Posts 를 찾아 반환 */
        const posts = await Post.find()
            /** 참조 중인 User 테이블에서 creator 필드를 채워서 반환 */
            .populate('creator')
            /**
             * - skip 메서드를 추가하면,
             *   find 로 찾은 결과중 첫 번째부터 skip 갯수만큼 생략한다
             */
            .skip( ( currentPage - 1 ) * perPage )
            /**
             * - limit 메서드는 find 로 가져오는 데이터양을 지정할 수 있다
             */
            .limit( perPage )

        res.status( 200 ).json( {
            message : 'Fetched posts successfully.',
            posts ,
            totalItems
        } );
    }
    catch ( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
};
````

- 또한 Mongoose 에서 지원하는 


- find() , countDocuments() , populate() 등의 메서드들은 실제로 Promise 객체를 반환하는것이 아니라,


- Promise 와 유사한 객체를 반환해줘 동일한 기능을 제공하는것이다


- 그러나, 실제 Promise 객체로 반환받고 싶다면 exec() 메서드를 이용하면 실제 Promise 객체를 반환받아 사용할 수 있다


- 또한 에러처리는 try , catch 를 사용한다

````javascript
/** ========== async await 적용 ========== */
/** ===== controllers/feed.js ===== */

/**
 * - 게시물 목록을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = async ( req , res , next ) => {
    /** 실제 Prmise 객체를 반환 */
  const totalItems = await Post.find().countDocuments().exec();

  const posts = await Post.find().exec();
}
````

- 그러나 hashing 처리하는 bcrypt 라이브러리 같은 경우는 실제 Promise 객체를 반환한다