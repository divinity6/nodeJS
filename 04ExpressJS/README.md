## Express.js

- NodeJS 를 이용한 기본적인 작동 방식 및 작성법을 알아보았다


- 그러나 NodeJS 만 사용할 경우,
  - 들어오는 요청의 바디를 추출하는등 기본적인 일을 처리하기 위해
  - 많은 코드들을 작성해야 한다


- Express.js 는 Node 프로젝트에 제3자 패키지로 설치할 수 있는 프레임워크로


- 필수적인 작업이나, 신경쓰고 싶지 않은 세부 내용을 외부에 맡길 수 있도록 도와주고,


- 핵심적인일에 집중할 수 있도록 도와주는 유틸리티 함수를 제공한다

---

### What's In This Module?

- Express.js 가 핵심으로 삼는 중요한 개념은 미들웨어( Middleware )이다


- Routing 을 이용해 요청 및 경로, URL 에 다른 코드를 실행시킬 수 있다


- HTML 파일을 전송함으로써 클라이언트에 파일을 전송할 수 있다

---

### What and Why?

- 서버 측 논리를 모두 작성하는 것은 상당히 복잡하다


- 따라서, 자잘한 코드들은 신경쓰지 않고 고유한 비즈니스 로직에 신경쓰도록 도와준다


- 무거운 작업들은 전부 프레임워크를 이용하여 처리한다
  - **프레임워크** : 도구와 규칙의 모음
  - 어플리케이션과 코드를 어떤 구조로 구축해야할지,
  - 어떻게 코드를 작성해야할지에 대한 규칙등

---

### Middleware

- express.js 는 미들웨어와 깊게 연관되어 있고,
  - 최종적으로 미들웨어₩ 들어오는 요청을 express.js 에 의한,
  - 다양한 함수를 통해 자동으로 이동하는 것이다
  - https://patterns-dev-kr.github.io/design-patterns/mediator-middleware-pattern/
  - 다양한 기능들을 함수하나로 처리하는 것이 아닌, 다양한 객체들로 나눠 처리할 수 있다


````javascript
const app = express();
/**
 * - use 메서드를 사용하면,
 *
 * - express.js 에서 제공하는 다양한 미들웨어 함수들을 이용할 수 있다
 * 
 * - 함수를 첫번째 파라미터로 작성하면, 들어오는 모든 요청에 대해 동작한다
 * 
 * - next 는 함수로 이 함수를 실행하면,
 * 
 * - 해당 app.use 콜백이 실행되고, 다음 use 에 작성한 콜백이 실행되도록 해준다
 */
app.use( ( req , res , next ) => {
  console.log( 'In the middleware!!' );
  next();
} );

/**
 *  next 를 실행하면 위의 코드를 실행 후, 아래에 있는 이 app.use 를 실행한다
 */
app.use( ( req , res , next )=> {
  console.log( 'In another middleware!!' );
} );


````

````javascript

/**
 * - send : express.js 에서 제공하는 유틸 메서드
 * 
 * - 기본 제공 타입은 text/html 이다
 */
res.send( any )


````

### Routing

- express.js 공식 문서
  - https://expressjs.com/en/4x/api.html


- **app.use** 의 첫 번째 파라미터로 path 를 설정할 수 있고, 파라미터만 넘겨줄 수도있다
  - 기본값은 '/' 이다
  - / 의 뜻은 도메인 뒤에오는 Path 가 / 라는뜻이 아니라,
  - 뒤에오는 Path 가 / 로 시작한다는 뜻이다


````javascript

app.use( '/add-product' , ( req , res , next )=> {
  console.log( 'In another middleware!!' );
  res.send( '<h1>Hello from Express!</h1>' );
} );

app.use( '/' , ( req , res , next )=> {
  console.log( 'In another middleware!!' );
  res.send( '<h1>Hello from Express!</h1>' );
} );

````

- add-product 요청을 위에 작성하는 이유는,
  요청이 파일 위에서부터 아래로 내려가고,


- next() 를 호출하지 않으면, 다음 미들웨어로 넘어가지 않기 때문이다


- 즉 add-product 경로를 만나면, 다음 use 를 실행하지 않는다!


- 위의 코드는 요청을 여러 미들웨어로 라우팅해준다


- **run 에 로그가 두개찍히는 이유는, favicon 요청때문!!**

````javascript

app.use( '/product' , ( req , res , next ) => {
    console.log( 'req.body' ,  req.body );
    res.redirect('/');
} );

````

- redirect 는 expressJS 의 또다른 편의성 함수


- 기본적으로 req 는 요청 본문을 해석하지 않는다


- 따라서, 요청 본문을 해석할 미들웨어를 따로 둬야한다


- 보통 요청 본문을 해석하는 미들웨어는 라우팅 미들웨어 이전에 두는데,


- 요청이 어디로 향하든 본문이 먼저 분석되어야 하기 때문이다 

````javascript

app.use( bodyParser.urlencoded() );

````

- 본문 해석 미들웨어
  - urlencoded 메서드는 내부에서 next 를 호출하여
  - 다음 라우팅 미들웨어를 실행하도록 해준다


- 또한 요청 본문을 파싱해준다
  - 파일등과 같은것은 다른 분석 미들웨어를 사용해야한다
  - 이것이 express.js 의 높은 확장성이다

````javascript

app.use();
app.get();
app.post();
app.patch();
app.put();
app.delete();

````

- HTTP 메서드의 갯수만큼 해당 요청에만 작동하는 메서드가 존재한다


````
|- /routes            # 라우팅 파일
|     |-  admin.js    # 매장관리자의 제품생성 처리 관련 라우팅 파일
|     |
|     |-  shop.js     # 사용자가 보게될 내용
````

- 라우팅 관련 코드를 /routes 폴더로 분리

````javascript

// /routes/admin.js
const router = express.Router();

router.use();
router.get();
router.post();
router.patch();
router.put();
router.delete();

module.exports = router;

// app.js
const adminRoutes = require( './routes/admin.js' );

app.use( adminRoutes );

````

- expressJS 에서 제공하는 router 를 이용하면, 다른 파일에서 app 의 메서드들을 그대로 이용할 수 있다


- export 로 내보내고, 해당 경로를 require 로 가져올 수 있다


- 이 라우터의 장점은 라우터 자체가 유효한 미들웨어 함수다


- 라우트 객체를 이용하여 app.use 에 미들웨어로 등록할 수 있다


- app.use 가 아닌, http 메서드를 이용하여 등록하면 
  - 도메인 뒤의 path 를 포함하는 값이 아니라, 
  - 정확히 일치하는 path 로 매핑된다
  - 따라서, 정확한 path 를 입력하지 않으면 에러가 발생한다
  - 그러나, 순서를 신경쓰는것은 중요한 습관이다

  
### Error

````javascript

// app.js

// ... 다른 라우팅 파일

app.use( ( req , res , next ) => {
  res.status( 404 ).send( '<h1>Page not found</h1>' );
} );

````

- error 페이지를 추가하려면, 모든 요청을 처리하는 router 를 맨 아래 추가해주면 된다
  - GET 요청 뿐만 아니라, 모든 http 메서드를 처리한다


- res 로 응답 처리 전에 메서드 체이닝으로 응답요청을 처리할 수 있다
  - setHeader
  - status 등...
  - 단지 마지막이 send 메서드이기만 하면 된다

---

### Path Filtering

````javascript

// app.js
app.use( '/admin' , adminRoutes );

// /routes/admin.js
router.get( '/add-product' , ( req , res , next )=> {
  res.send( '' +
          '<form action="/add-product" method="POST">' +
          '<input type="text" name="title" />' +
          '<button type="submit">Add Product</button>' +
          '</form>' );
} );

router.post( '/add-product' , ( req , res , next ) => {
  console.log( 'req.body' ,  req.body );
  res.redirect( '/' );
} );

````

- 같은 add-product 경로라도, http 메서드가 다르면 다른 라우터가 된다


- 오직 /admin 으로 시작하는 router 만이 admin.js 를 탄다


- 즉, app.use 메서드의 첫 번째 파라미터로 공통 root 라우터를 지정할 수 있다
  