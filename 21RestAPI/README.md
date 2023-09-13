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