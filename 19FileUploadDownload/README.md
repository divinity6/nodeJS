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

- 항상 공개된 파일만 제공하지는 않기 때문에 당사자만 접근가능한 파일경로가 필요하다


- 따라서, 제한된 파일일 경우, invoice 에 특정된 라우트를 설정해야 사용자 인증여부등을 체크할 수 있다


- view 에서는 동적 라우트를 호출하고, route 에서 해당 요청을 받아 controller 로 전달한다

````ejs
<!-- ===== views/shop/orders.ejs ===== -->
<li class="orders__products-item">
  <%= p.product.title %> (<%= p.quantity %>)
  - <a href="/orders/<%= order._id %>">Invoice</a>
</li>
````

- 라우트에서 해당 동적라우트에 해당하는 컨트롤러 설정

````javascript
/** ===== routes/shop.js ===== */
/** 로그인이 되어있어야만 접근가능 */
router.get( '/orders/:orderId' , isAuth , shopController.getInvoice );
````

- 컨트롤러에서 설정된 invoice 경로에서 orderId 와 같은 파일을 찾아 반환

````javascript
/** ===== controller/shop.js ===== */
const fs = require( 'fs' );
const path = require("path");
/**
 * - Invoice Controller
 *
 * --> 인증 파일제공 컨트롤러
 *
 * @param req
 * @param res
 * @param next
 */
exports.getInvoice = ( req , res , next ) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${ orderId }.pdf`;
  /** 모든 OS 에서 동작하도록 path 모듈을 이용하여, 해당 파일 경로를 찾는다 */
  const invoicePath = path.join( 'data' , 'invoices' , invoiceName );
  fs.readFile( invoicePath , ( err , data ) => {
    /**
     * - error 가 존재할 경우, 기본 에러핸들러에서 처리하고,
     *   error 가 존재하지 않을 경우에는 찾은 데이터( 파일 )를 전달함
     */
    if ( err ){
      return next( err );
    }
    /** 브라우저에 pdf 라는 정보를 제공하면 브라우저 내부에서 해당 파일을 inline 으로 연다 */
    res.setHeader( 'Content-Type' , 'application/pdf' );
    /**
     * - 클라이언트에게 콘텐츠가 어떻게 제공되는지 정의할 수 있다
     *
     * inline : 브라우저에서 열림
     * attachment : 파일을 다운로드함
     * */
    res.setHeader( 'Content-Disposition' , `inline; filename="${ invoiceName }"` );
    /** 해당 파일을 브라우저에 전달 */
    res.send( data );
  } );
}
````

- 현재 인증된 사용자만 invoice 에 접근할 수 있다
  - ( 라우트에 isAuth 콜백이 설정되어 있기 때문... )
  - 그러나 해당 주문을 한 사용자가 아니어도, 다른사용자들도 볼 수 있다


- 따라서, 해당 파일을 전달하기 전에, DB 에서 해당 주문을한 사용자를 찾고, 


- 해당 사용자와 로그인한 사용자가 일치하는지 검증하면된다

---

- 현재, 위의방식으로 파일시스템에 접근을하게 되면( fs.readFile ), NodeJS 가 파일시스템에 접근해, 콘텐츠 전체를 메모리로 읽어들인 후 응답과 함께반환한다
  - 즉, 파일의 크기가 크다면, 응답을 보내는데 아주 오래걸린다


- 서버의 메모리가 어느시점에 오버플로우될 수 있다. 들어오는 요청이 너무 많아지면, 


- 모든 데이터를 메모리로 읽어들이는데, 메모리에 제한이 존재하기 때문에 파일 데이터를 읽어서 응답으로 제공하는것은 좋은 방법이 아니다


- 대신, 데이터를 스트리밍하는 방법이 좋다


- 데이터를다 브라우저에 스트리밍하게되면, 일반 파일시스템과는 다르게, **브라우저에 의해 차근차근 다운로드** 된다
  - 크기가 큰 파일일수록 큰 장점이 있다
  - Nodejs 가 모든 데이터를 메모리로 읽어들이지 앟고, 그때그때 브라우저로 스트리밍해서, 한 Chunk 의 데이터만 저장하면 된다
  - 즉, 모든 Chunk 가 한번에 들어오기를 기다려서, 한 객체로 연결시키는것보다,
  - 그때그때, 브라우저에 전달해, 브라우저가 들어오는 데이터조각을 하나의 최종 파일로 결합시키도록 하는 것이다
  

- 즉, stream 을 이용해 브라우저에 전달하면, 서버에 부담을 덜어주고, 브라우저 환경에서 빠르게 실행시킬 수 있다

````javascript
/** ===== controller/shop.js ===== */
const fs = require( 'fs' );
const path = require("path");
/**
 * - Invoice Controller
 *
 * --> 인증 파일제공 컨트롤러
 *
 * @param req
 * @param res
 * @param next
 */
exports.getInvoice = ( req , res , next ) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  /** 모든 OS 에서 동작하도록 path 모듈을 이용하여, 해당 파일 경로를 찾는다 */
  const invoicePath = path.join('data', 'invoices', invoiceName);

  /**
   * - 스트리밍 방식으로 파일을 읽는다.
   *
   * - 즉, 청크( Chunk )단위로 파일을 읽는다
   */
  const file = fs.createReadStream( invoicePath );
  /** 브라우저에 pdf 라는 정보를 제공하면 브라우저 내부에서 해당 파일을 inline 으로 연다 */
  res.setHeader( 'Content-Type' , 'application/pdf' );
  /**
   * - 클라이언트에게 콘텐츠가 어떻게 제공되는지 정의할 수 있다
   *
   * inline : 브라우저에서 열림
   * attachment : 파일을 다운로드함
   * */
  res.setHeader( 'Content-Disposition' , `inline; filename="${ invoiceName }"` );

  /**
   * - pipe 메서드를 이용해 읽어들인 데이터를 res 로 전달
   *
   * --> response 는 쓰기 가능한 스트림이기 때문에, 읽기 가능한 스트림을 사용해,
   *     출력값을 쓰기 스트림으로 전달한다
   *
   *  - 응답이 데이터를 가지고 브라우저로 스트리밍된다
   */
  file.pipe( res );
}
````

---

### createPDF

- 서버에서 PDF 를 즉시생성하는 방법


- 주문을 받을때, 실제 주문 데이터를 기반으로 PDF 파일을 생성


- PDFKit 은 PDF 생성시 자주 사용되는 패키지다

````shell
npm install --save pdfkit
````

- pdfDoc 스트림은 읽을 수 있는 파일스트림을 제공하기 때문에 


- 쓰기가능 res 스트림에 pipe 할 수 있다

````javascript
/** ===== controller/shop.js ===== */
const fs = require( 'fs' );
const path = require("path");
const PDFDocument = require( "pdfkit" );

/**
 * - Invoice Controller
 *
 * --> 인증 파일제공 컨트롤러
 *
 * @param req
 * @param res
 * @param next
 */
exports.getInvoice = ( req , res , next ) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  /** 모든 OS 에서 동작하도록 path 모듈을 이용하여, 해당 파일 경로를 찾는다 */
  const invoicePath = path.join('data', 'invoices', invoiceName);


  /** pdfDoc 객체는 읽을 수 있는 스트림에 해당한다 */
  const pdfDoc = new PDFDocument();

  /** 브라우저에 pdf 라는 정보를 제공하면 브라우저 내부에서 해당 파일을 inline 으로 연다 */
  res.setHeader( 'Content-Type' , 'application/pdf' );
  /**
   * - 클라이언트에게 콘텐츠가 어떻게 제공되는지 정의할 수 있다
   *
   * inline : 브라우저에서 열림
   * attachment : 파일을 다운로드함
   * */
  res.setHeader( 'Content-Disposition' , `inline; filename="${ invoiceName }"` );

  /**
   * - fs 에서 읽을 수 있는 파일스트림으로 만들어 pdfDoc 의 pipe 메서드에 전달한다
   *
   * --> path 를 설정해, 해당 파일을 클라이언트 뿐만 아니라, 서버에도 저장되도록 한다
   */
  pdfDoc.pipe( fs.createWriteStream( invoicePath ) );
  /**
   * - 결괏값을 응답에도 pipe 한다
   *
   * --> res 는 쓰기가능한 스트림이고, pdfDoc 은 읽기가능하기 때문에 진행할 수 있다
   */
  pdfDoc.pipe( res );
  pdfDoc.text( 'Hello word!' );   // text 한줄 추가
  pdfDoc.end();   // pdf 의 쓰기가 완료됨을 알림
}
````

- PDF 문서를 한글로 렌더링하려면 한글폰트를 추가해줘야한다

````javascript
/** ===== controller/shop.js ===== */
const fs = require( 'fs' );
const path = require("path");
const PDFDocument = require( "pdfkit" );

/**
 * - Invoice Controller
 *
 * --> 인증 파일제공 컨트롤러
 *
 * @param req
 * @param res
 * @param next
 */
exports.getInvoice = ( req , res , next ) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  /** 모든 OS 에서 동작하도록 path 모듈을 이용하여, 해당 파일 경로를 찾는다 */
  const invoicePath = path.join('data', 'invoices', invoiceName);


  /** pdfDoc 객체는 읽을 수 있는 스트림에 해당한다 */
  const pdfDoc = new PDFDocument();

  /** 브라우저에 pdf 라는 정보를 제공하면 브라우저 내부에서 해당 파일을 inline 으로 연다 */
  res.setHeader( 'Content-Type' , 'application/pdf' );
  /**
   * - 클라이언트에게 콘텐츠가 어떻게 제공되는지 정의할 수 있다
   *
   * inline : 브라우저에서 열림
   * attachment : 파일을 다운로드함
   * */
  res.setHeader( 'Content-Disposition' , `inline; filename="${ invoiceName }"` );

  /**
   * - fs 에서 읽을 수 있는 파일스트림으로 만들어 pdfDoc 의 pipe 메서드에 전달한다
   *
   * --> path 를 설정해, 해당 파일을 클라이언트 뿐만 아니라, 서버에도 저장되도록 한다
   */
  pdfDoc.pipe( fs.createWriteStream( invoicePath ) );
  /**
   * - 결괏값을 응답에도 pipe 한다
   *
   * --> res 는 쓰기가능한 스트림이고, pdfDoc 은 읽기가능하기 때문에 진행할 수 있다
   */
  pdfDoc.pipe( res );
  /**
   * - PDF 셋 설정을 할 수 있다
   */
  pdfDoc.registerFont( 'NotoSansCKJ', path.join( 'public' , 'font' , 'NotoSansKR-Medium.ttf' ) );
  pdfDoc.font( 'NotoSansCKJ' );
  pdfDoc.fontSize( 26 ).text( 'Invoice' , {
    underline : true,
  } );   // text 한줄 추가
  pdfDoc.text( '---------------------------' );
  let totalPrice = 0;
  order.products.forEach( prod => {
    totalPrice += prod.quantity * prod.product.price;
    pdfDoc
            .fontSize( 14 )
            .text(
                    `${ prod.product.title } - ${ prod.quantity } x $${ prod.product.price }` );
  } );
  pdfDoc.text( '---' );
  pdfDoc.fontSize( 20 ).text( `Total Price: $${ totalPrice }` );


  pdfDoc.end();   // pdf 의 쓰기가 완료됨을 알림
}
````

- 현재는 이미지를 저장하면, 계속해서 images 폴더에 불필요한 이미지가 쌓인다


- 따라서, 제품을 편집할때, 해당 이미지를 제거하는 작업을 추가해줘야한다


- 파일제거를 도와주는 helper 함수를 작성하고, 제품 수정, 제거시 해당 파일경로에 존재하는 파일을 제거하도록 한다

````javascript
/** ===== util/file.js ===== */
/**
 * - 파일관련 helper 유틸
 */
const fs = require( 'fs' );

/**
 * - 파일 경로를 전달하여 해당 경로의 파일을 제거
 * @param { string } filePath - 제거할 파일 경로 + 파일명
 */
const deleteFile = ( filePath ) => {
  /**
   * - 해당 이름과 이름에 연결된 파일을 삭제하는 메서드
   */
  fs.unlink( filePath , ( err ) => {
    if ( err ){
      throw (err);
    }
  } );
}
exports.deleteFile = deleteFile;
````

- 실제 제품을 수정하거나 제거할때, 해당 파일도함께 제거한다

````javascript
/**
 * - 제품 수정  Controller
 * @param req
 * @param res
 * @param next
 */
exports.postEditProduct = ( req , res , next ) => {
    const image = req.file;
    Product
        .findById( prodId )
        /**
         * - product 가 mongoose 객체이기 때문에,
         *   해당 model 객체의 프로퍼티를 수정해주고,
         *   저장해주면 업데이트가 된다
         */
        .then( product => {
            /** 제대로된 이미지 경로가 존재할 경우에만 이미지 경로 설정 */
            if ( image ){
                /** 이전의 파일제거 */
                fileHelper.deleteFile( product.imageUrl );
                product.imageUrl = image.path;
            }
        });
}


/**
 * - 제품 제거 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postDeleteProduct = (  req , res , next ) => {
    const prodId = req.body.productId;
    
    Product.findById( prodId )
        .then( product => {
            /** 이전의 파일제거 */
            fileHelper.deleteFile(product.imageUrl);
        } )
}
````

---

- MMulter 공식 참고자료: https://github.com/expressjs/multer


- 스트리밍 파일: https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93


- PDFKit으로 PDF 생성하는 법: http://pdfkit.org/docs/getting_started.html