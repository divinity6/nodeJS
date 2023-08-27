## FileUploadDownload

- 파일 업로드 및 다운로드


- 들어오는 요청을 간편하게 해석하기위해 bodyParser 미들웨어를 사용하는데, 해당 미들웨어는 여러가지 파서를 제공한다


- 현재는 urlencoded 파서를 사용하며, URL 인코딩된 데이터는 **텍스트 데이터**다


-즉, 파일없이 텍스트 필드만 html form 에서 제출된 경우, 


- 텍스트 필드에 number , URL , string 의 저장 여부등을 불문하고,


- 모두 text 로 인코딩되어 제출된다


- 그런데, 파일의 경우 기본적으로 이진 데이터이기 때문에 텍스트로 추출할 수 없다


````javascript
/** ===== app.js ===== */
const bodyParser = require( 'body-parser' );
/**
 * - 본문 해석 미들웨어
 *
 * - urlencoded 메서드는 내부에서 next 를 호출하여
 *
 * - 다음 라우팅 미들웨어를 실행하도록 해준다
 */
app.use( bodyParser.urlencoded({ extended : false } ) );
````

- 따라서, 파일업로드 처리를 하려면 다른 종류의 파서를 설치해 처리해야 한다


- Multer

````shell
npm i --save multer
````

- multer 는 들어오는 요청을 분석하는 또다른 패키지인데,


- 텍스트와 파일이 혼합된 데이터의 요청도 처리할 수 있다


- 또한, view 의 <form></form> 태그에서 enctype 으로 전송하는 데이터의 인코딩 타입을 변경해야한다
  - application/x-www-form-urlencoded : 기본값( 모든 문자 인코 )
  - multipart/form-data : 모든 문자 인코딩하지 않음
  - text/plain : 공백문자는+로 변환하지만, 나머지는 인코딩하지 않음


- form 의 인코딩 타입을 multipart/form-data 로 설정해주면, 


- multer 가 들어오는 요청을 탐색하고 텍스트와 파일을 모두 분석할 수 있다

````ejs
<form
        class="product-form"
        action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>"
        method="POST"
        enctype="multipart/form-data">
</form>
````

- multipart/form-data 의 데이터를 분석하는 파서이다


- 단일 파일의 필드를 파싱할때는, 아래처럼 파싱할 단일 필드를 지정해줄 수 있다


- image 필드를 파싱해두면, req.file 필드로 접근할 수 있는데 buffer 객체를 담은 객체로 반환하게 된다

````javascript
const multer = require( 'multer' );
/** ===== app.js ===== */
/** image body 필드값을 가져온다 */
app.use( multer().single( 'image' ) );
````

- 아래 데이터 형태중 Buffer 는 노드가 이진 데이터를 핸들링( 처리 )하는 방식이다
  - 해당 데이터가 스트림 되는데 스트림되는 데이터를 저장한 버퍼 객체라는 뜻!


- 해당 버퍼를 파일로 변환할 수 도 있다

````json
{
  "fieldname": "image",
  "originalname": "Screenshot-2021-08-17-at-10.26.28-PM-1.png",
  "encoding": "7bit",
  "mimetype": "image/png",
  "buffer": "<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 07 d0 00 00 06 06 08 06 00 00 00 f8 28 30 ff 00 00 00 09 70 48 59 73 00 00 16 25 00 00 16 25 01 ... 666039 more bytes>",
  "size": 666089
}
````

- multer 를 설정할때 여러가지 옵션을 설정할 수 있는데 ,dest 옵션을 설정하면,


- 데이터를 전부 메모리에 버퍼링하는대신, 그 버퍼를 이진 데이터로 변환하여 path 필드의 경로에 파일로 저장한다


- ( dest 옵션으로 경로를 추가 )

````javascript
const multer = require( 'multer' );
/** ===== app.js ===== */
/** image body 필드값을 가져온다 */
app.use( multer( { dest : 'images' } ).single( 'image' ) );
````

- 이진 데이터 파일을 path 경로( images/ )에 추가한다


- 해당 파일은 무작위 hash 값을 가지며, 파일 확장자는 가지지 않고 이미지로 인식되지 않는다


- 그러나, 해당 파일의 확장자를 mimetype 확장자로 설정해주면 업로드했던 이미지로 변경된다

````json
{
  "fieldname": "image",
  "originalname": "Screenshot-2021-08-17-at-10.26.28-PM-1.png",
  "encoding": "7bit",
  "mimetype": "image/png",
  "destination": "images",
  "filename": "8070c63baa6866387b1e24da09f37fcf",
  "path": "images/8070c63baa6866387b1e24da09f37fcf",
  "size": 666089
}
````


- multer 에서는 dest 옵션 뿐만 아니라, 더 많은 옵션을 추가할 수 있다


- 예를들어, storage 옵션은 저장소를 선택할 수 있다


- multer.diskStorage 는 multer 와 사용할 수 있는 저장소 엔진이며, JS 객체를 전달하여 구성할 수 있다 


- destination : multer 에서 처리할 파일을 저장할 위치를 설정할 수 있으며,


- filename : multer 에서 처리할 파일이름을 지정할 수 있다


- destination , filename 은 파라미터로 전달되는 callback 을 실행하여 파일 정보를 저장할 수 있다

````javascript
const multer = require( 'multer' );
/** ===== app.js ===== */
/** 파일을 저장할 장소 설정 */
const fileStorage = multer.diskStorage( {
  /** multer 에서 처리한 파일을 저장할 위치 */
  destination : ( req , file , callback ) => {
    /**
     * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
     *
     * - 두번째 param - 파일을 저장할 경로
     *
     */
    callback( null , 'images' );
  },
  /** multer 에서 처리한 파일의 파일이름*/
  filename : ( req , file , callback ) => {
    /**
     * - 첫번째 param - 에러 메시지( 존재하면, 에러가 있는것으로 판단 )
     *
     * - 두번째 param - 파일 이름
     */
    callback( null , file.fieldname + '-' + file.originalname );
  }
} );


/** image body 필드값을 가져온다 */
app.use( multer( { storage : fileStorage } ).single( 'image' ) );
````

- 이 저장소 설정값을가지고, 원하는 파일들만 걸러내거나, gif, pdf 는 지원하지 않는등의 유효성검사들도 진행할 수 있다


- multer 는 특정종류의 파일만 저장할 수 있도록 파일종류를 명시할 수 있다

````javascript
const multer = require( 'multer' );
/** ===== app.js ===== */
/** 저장할 파일종류 설정 */
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


/** image body 필드값을 가져온다 */
app.use( multer( { storage : fileStorage , fileFilter } ).single( 'image' ) );
````

- 파일같은경우는 파일 시스템( 서버 컴퓨터안 폴더등 )에 저장해야한다


- DB 에 저장하기엔 파일은 크기가 너무 크기때문에, 


- DB 에 저장하고, 쿼리하는것은 너무 비효율적이다


- DB 에는 파일에 연결되는 경로를 저장해준다


- 즉, 자기 컴퓨터의 파일이 저장되는 경로를 지정해준다
  - ( 나중에, 해당 이미지를 가져올때, 경로에서 가져오면 되기 때문 )

````javascript
/** ===== controller/admin.js ===== */
exports.postAddProduct = ( req , res , next ) => {
  const image = req.file;

  /** 자기자신 컴퓨터에 있는 이미지 경로를 가져와 경로 저장 */
  const imageUrl = image.path;

  const product = new Product( {
    title ,
    price ,
    description ,
    imageUrl ,
    /** Mongoose 에서는 user 전체를 넣어도 user._id 를 찾아서 할당해준다... */
    userId : req.user
  } );
}
````

- 제품을 편집 및 업데이트할때도 마찬가지로, 이미지경로를 불러오는데, 


- 편집시 경로가 유효하지 않다면, 경로를 저장하지않으면 된다

````javascript
/** ===== controller/admin.js ===== */
exports.postEditProduct = ( req , res , next ) => {

  const { title , price , description , productId } = req.body;
  const prodId = productId;
  const image = req.file;  
    
  Product
          .findById( prodId )
          .then( product => {
            product.title = title;
            product.price = price;
            /** 제대로된 이미지 경로가 존재할 경우에만 이미지 경로 설정 */
            if ( image ){
              product.imageUrl = image.path;
            }
            product.description = description;
          
            product.save();
  } )
}
````

- 이미지 경로를 저장 및 수정까지는 했지만, 저장한 이미지경로에서 이미지를 가져와야하는데


- 이방법은 크게 2가지가 있다


### static 방식으로 images 폴더 제공하는 방법


- app.js 에서 이미 express.static 미들웨어를 통해 정적 폴더를 제공하고 있다


````javascript
  /** ===== app.js ===== */
  app.use( express.static( path.join( __dirname , 'images' ) ) );
````


- 정적으로 폴더를 제공한다는 것은, 해당 폴더에 대한 파일의 요청이 자동으로 처리되어, 파일이 반환된다는 뜻이다
  - ( express.js 가 배후에서 무거운 작업을 전부 진행한다는 뜻 )


- 또한 해당방법으로 파일을 제공하게 될경우, express.js 가 static 폴더에 있는 내용들을 자동으로 root 폴더에서 제공하도록 변경한다
  - 즉, 아래와 같은 url 로 파일을 요청하는것이 아니라,
  
  ````text
   http://localhost:3000/images/image-1693123287537-raiden.png
  ````

  - 아래와 같은 url 로 요청해야 제공해준다
  ````text
   http://localhost:3000/image-1693123287537-raiden.png
  ````
  

- 따라서, static 방식으로 파일을 제공해야할 경우에는, 아래와 같이 root 경로를 지정해줘야 한다
````javascript
  /** ===== app.js ===== */
  app.use( '/images' , express.static( path.join( __dirname , 'images' ) ) );
````

### invoice 방식으로 제공하는 방법( 인증으로 파일 다운로드 )