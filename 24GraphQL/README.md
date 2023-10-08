## GraphQL

- REST ful API 를 구축하는 다른 방법


- 특정 경우에서는 REST API 보다 훨씬 이점이 있다

---

### What is GraphQL?

- REST API : 무상태로 클라이언트와 독립되어 데이터를 교환하는 API
  - View 를 렌더링하거나, 세션을 저장하지 않고, 클라이언트를 고려하지 않으며,
  - 오직 요청을 받고 데이터를 분석한 후 JSON 데이터와 함께 응답을 반환한다


- GraphQL API : 무상태로 클라이언트와 독립되어 데이터를 교환하는 API
  - 중요한점은 REST API 보다 쿼리 유연성이 높다

---

#### REST API Limitations ( REST API 의 한계 )

- 만약, REST API 에서 요청을 보냈을 시 해당 데이터를 반환하는 API 가 존재한다고 가

> **GET/post**

> Fetch Post

> ````json
> {
>   "id" : "1",
>   "title" : "First Post",
>   "content" : "...",
>   "creator" : { ... }
> }
> ````

- 그러나, 클라이언트에서 title 과 id 만 필요하고, content 나 creator 가 필요하지 않은 경우는 어떻게 해야할까?
  - client 가 만약 모바일이라면, 많은 데이터를 전송받을때 문제가 생길 수 있기 때문 
 

- **첫 번째**, 다양한 유형의 데이터를 반환하는 EndPoint 들을 더 만드는 것( 많은 API 를 만드는 것 )
  - 그러나 이때, EndPoint 가 너무 많으면, 지속적으로 업데이트할때 유지보수성이 떨어진다
  - 예를 들어, frontend 에서 새로운 페이지를 추가해야할 경우, backend 에서 알맞는 API 를 작성해줘야한다


- **두 번째**, query 파라미터를 이용하는 것
  - 이 또한, backend 에서 query 에 따라 복잡한 분기처리를 해서 내보내줘야 한다


- **세 번째**, GraphQL
  - 위처럼,클라이언트 앱에서 다양한 요청 요구사항이 있을 경우, 이상적인 해결 방안이다
  - GraphQL 에는 다양한 query 파라미터가 있어서, 필요한 데이터를 검색할 수 있다
  - 즉, Sequelize 나 Mongoose 처럼 DB 에 보내는 다양한 쿼리언어가 Frontend 에 존재하게 된다

> **POST/grapql**
> 
> 클라이언트에서 서버에 HTTP 요청을 보내는 단 하나의 엔드 포인트만 존재한다
> 
> ---
> 
> GraphQL 은 고유의 쿼리 언어를 요청 본문에 정의할 수 있다
> 
> ---
> 
> 이후, 서버는 해당 요청 본문을 해석해서 알맞는 데이터를 반환하는 방법으로 동작한다

> graphQL 은 아래처럼 응답 유형에 따라 query , mutation ,subscription 등에 데이터를 담고,
> 
> 그다음 nested 객체 명은 backend EndPoint API 이름으로 감싸 반환한다
> 
> ````json
> {
>   "query" : {
>     "user" : {
>       "name" : "Max",
>       "age" : "18"
>      }
>   }
> }
> ````

---

### Operation Type

- **Query** : 데이터를 검색하기 위해 POST 요청 사용
  - ( REST API 에서는 일반적으로 GET 요청 )


- **Mutation** : 일반적으로 데이터를 변경하는 모든 경우 사용
  - ( REST API 에서는 POST , PUT , PATCH , DELETE 요청들 )


- **Subscription** : 웹 소켓을 통해 실시간 연결일 경우 사용

---

### GraphQL Big Picture

- 클라이언트에서 서버의 단일 GraphQL EndPoint 에 요청을 보내고,


- 서버에서는 Query , Mutation ,Subscription 등의 응답 데이터 타입 정의 설정
  - ( 일반적인 Application 의 Route 역할 )


- 해당 요청 타입들은 서버 측 논리를 포함한 **Resolver** 함수에 연결된다
  - ( 일반적인 Application 의 Controller 역할 )


- 쿼리 표현을 요청 본문에 넣기 위해 오직 POST 요청만 사용한다