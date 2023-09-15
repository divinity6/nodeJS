## RestAPI

- RestAPI 를 사용하는 이유는 모든 Frontend UI 가 HTML 페이지를 사용하지 않기 때문이다
  - 앱이나 IOS , Swift 등은 HTML 을 사용하지 않고 UI 를 렌더링하기 때문이다


- 이때 구축하는 UI 는 서버로부터 완전히 분리되기 때문에, HTML 이 필요하지 않다
  - 단지 화면을 그리기위한 데이터만 필요할 뿐이다


- 데이터를 기반으로 JS 를 통해 화면을 렌더링한다


- 서로 데이터만 교환하고, UI 는 교환하지 않는, 즉,


- Frontend 는 UI 를 담당하고, **BackEnd 는 데이터만 담당하는것으로 역할을 분리**하는 것이 RestAPI 다 


- RestAPI 의 REST 는 **Representational State Transfer** 의 약자로 사용자 인터페이스 대신 데이터 전송을 의미한다


- Frontend 는 앱이든 웹이든 Desktop 이든 전송받은 데이터로 렌더링하는 역할만 한다


- 중요한점은 **서버는 응답하는 데이터만 바뀌고, 서버측 주요논리**는 바뀌지 않는다
  - 즉, **서버에서 일어나는 일은 그대로이고, 응답과 전송, 주고받는데이터만 바뀐다**

---

- 서버에 API 구축할때, 여러 frontend client 를 위해 하나의 API 를 사용할 수도 있다
  - 모바일 앱과 웹 앱이 동일한 데이터를 사용해 처리한다
  

- html 은 xml 의 한 유형인데, xml 은 태그이름을 자유롭게 지정할 수 있다
  - 그러나 마찬가지로 성능이 좋지않아 JSON 을 사용한다


- 다른데이터형식들은 JSON 만큼 간편하고 명확하지 않아 JSON 이 RestAPI 를 구현할때 사용된다


- API endPoint 는 HTTP method + Routing 경로를 의미한다
  - 예) API EndPoint : 
    - GET/posts
    - POST/post
    - GET/posts/:postId


- 브라우저에서 JS 를 이용하지 않고, < form > 태그나 < a > 태그를 이용해 통신할때는,
  - GET , POST 만 사용가능하다
  - ( 브라우저와 HTML 이 알고있는 기본 메서드 )


- JS 를 통해 다른 HTTP 메서드들을 다뤄야 한다


- GET, POST , PUT , PATCH , DELETE 외에도 OPTIONS 라는 특별한 HTTP 메서드가 존재한다
  - 브라우저가 자동으로 보내는 메서드이다
  - 브라우저가 자동으로 요청을 보내 다음 요청이 무엇인지 알아보는 용도로 쓰인다
  - 예) 다음요청이 DELETE 요청이라면 해당 요청이 허용되는지 여부


- REST API 로 작성할때, 각 역할에 맞도록 요청에 HTTP 메서드를 사용하는 것이 좋다
  - 반드시 그래야하는 건 아니지만 지킬수록 좋다

---

### REST API Principles

- REST API 를 구축할때는 2가지 핵심 규칙을 명심해야한다


- **1. 일관된 인터페이스 원칙**
  - API 에 명확하게 정의된 API 엔드포인트를 가져야 한다
  - 즉, API 만 보고도 예측이 가능해야 한다
  - API 가 어떤 데이터를 필요로하고, 반환하는지 알 수 있다


- **2. 무상태 상호작용 원칙**
  - 인증에서 매우 중요한 원칙이다
  - 클라이언트, 서버는 완전히 분리되어 있고, 히스토리를 공유하지 않는다
  - 히스토리가 저장되지 않고, 들어오는 모든 요청에 대해 세션에 저장하지 않는다
  - 즉, 어떤 클라이언트에서 요청이 오든 신경쓰지 않는다
  - 단지, 데이터를 받을 엔드포인트를 제시하고 전달해주기만하면 더이상 관심을 가지지 않는다
  - 따라서, **새로운 요청을 생성하더라도, 이전 요청과 독립적으로 기능하는지 체크**해야 한다

---

- 이 아래는 옵션 원칙이다


- 3. 캐싱 가능 원칙
  - REST API 에서 Header 를 전송해 클라이언트에게 응답의 유효시간을 알려줌으로써,
  - 클라이언트가 응답을 캐싱할 수 있도록 해주는 기능


- 4. 클라리언트와 서버간의 분리
  - 클라이언트는 지속적인 데이터 저장에 신경쓰지 않는다( 서버의 역할 )


- 5. 계층형 API
  - 요청을 받은서버가 요청을 즉시 처리하는대신, 다른 서버로 전달할 수 있다
  - 즉, 응답하는 데이터에만 관심이 있다


- 6. 주문형 코드
  - 엔드포인트에서 실행 가능한 코드를 전송할 수 도 있다

---

### Rebuilding

- REST_API 구조로 패키지를 다시 재구성한다


- RestAPI 를 사용함으로써, 더이상 res.render 를 반환할 필요가 없다


- json 형식의 데이터만 반환하면 된다


- Response 객체의 파라미터로 js 객체를 넣으면 json 형태로 변환해서 반환해준다

````javascript
/**
 * - 게시물들을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = ( req , res , next ) => {
  /**
   * - expressJS 에서 제공하는 json 메서드
   *
   * --> json 메서드를 이용하면 응답헤더에 자동으로 application/json 를 할당해준다
   * */
  res.status( 200 ).json( {
    posts : [ { title : 'First Post' , content : 'This is the first post' } ]
  } );
};
````

- 사용자가 보내는 요청을 분석할때, bodyParser 패키지를 이용하는데,


- 지금까지는 bodyParser 패키지의 urlencoded() 메서드를 이용했다'


- 해당 메서드는 x-www-urlencoded 형식의 데이터를 파싱하는 bodyParser 다
  - 기본적으로 < from > 에서 보내는 요청( POST , GET )은 이런 형식의 데이터를 보낸다


````javascript
const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const app = express();

/** x-www-urlencoded 형식을 파싱할때 사용하는 bodyParser 다 */
app.use( bodyParser.urlencoded() );
````

- 대신 RestAPI 를 사용함으로써 들어오는 body 요청을 JSON 형식으로 분석하게 된다


- json() 메서드를 사용하게 되면, 요청을 json 으로 파싱해 body 에 부착하게 된다

````javascript
const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const app = express();

/** application/json 형식을 파싱할때 사용하는 bodyParser 다 */
app.use( bodyParser.json() );
````

- 이렇게 구축한 RestAPI 를 테스트하는 간편한 방법으로 [ PostMan ]( https://www.postman.com/ ) 이 존재한다


- PostMan 을 이용해 API 주소에 요청하면 응답값을 간편하게 받아볼 수 있다
  - 즉, 간편하게 테스트해볼 수 있는 매우 편리한 사이트다