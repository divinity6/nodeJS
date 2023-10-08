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

---

### How to Install Server

- graphQL 을 사용할 것이기 때문에, route 폴더( app.js 에서 사용하는 route 들 전부 )와 socket.io 라이브러리를 제거한다


- 그 후 graphql 과 express-graphql 패키지를 설치한다
  - express-graphql 은 graphql 14.7.0 이나, 15.3.0 버전과 호환된다

````shell
npm i graphql@15.3.0 --workspace=<< 워크스페이스_이름 >>
````

````shell
npm i express-graphql --workspace=<< 워크스페이스_이름 >>
````

- 상위 버전을 사용하려면, express-graphql 이 아닌, graphql-helix 를 사용하면 된다

- 추가되는 패키지 구조
````
server/
|
|– graphql/                          # graphql 관련된 코드들
|   |
|   |– schema.js                     # Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의( router 역할 )
|   |
|   |– resolvers.js                  # 들어오는 Query 를 위해 실행되는 논리등( controller 역할 )
|
|– app.js
````

---

### How to Install Client

- 현재 프로젝트 기준, Feed.js 에서 openSocket 관련된 코드와 addPost , updatePost 메서드들을 제거한다
  - ( 나중에 다르게 작성할 예정 )

- 아래 파일 수정
````
client/
|
|– src/                          
    |
    |– pages/                     
        |
        |– Feed/                 
            |
            |– Feed.js                  # openSocket , addPost , updatePost 제거
````

---

### How to Use?

- GraphQL 의 가장 큰 특징으로 하나의 EndPoint 로 받고자 하는 frontend 데이터를 정의할 수 있다

### Query 를 사용하여 데이터 요청

---

#### schema.js

- Rest API 의 Route 역할로, 응답하고자하는 Schema 를 정의한다


- 이때, 벡틱( `` )을 이용하여 선언하는데, GraphQL 에 내장된 유형은 String , Int , Float , Boolean , ID 등이 있다
  - 필드는 콤마( , )를 사용하지 않고, 반환하고자 하는 타입들을 선언한다
  

- **type** :
  - type TestData {}등, 반환하고자 하는 데이터 응답 타입을 정의한다( key : value 형태 )
  - 이때, 응답 타입에 ! 를 붙이면 required 가 된다( String! )


- **schema** :
  - 사용하고자 하는 type 필드를 정의 및 작성한다( 이때, query 로 받을지, Mutation 으로 받을지 등등을 설정한다 )

````javascript
/** ===== graphql/schema.js ===== */

/** Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의 */
const { buildSchema } = require( 'graphql' );

module.exports = buildSchema( `
    type TestData {
        text : String!
        views : Int!
    }

    type RootQuery {
        hello: TestData
    }
    
    schema {
        query: RootQuery
    }
` );
````

---

#### resolvers.js

- Rest API 의 Controller 역할로, 생성한 Schema 의 반환 메서드 및 논리를 정의한다


- 이때, **Schema 에 정의된 각 Query , Mutation 등의 이름과 일치하는 메서드**가 필요하다
  - ( Query 이름이 위의 RootQuery 타입에서는 hello 이기 때문에 hello 메서드가 필요하다 )

````javascript
/** ===== graphql/resolvers.js ===== */

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
  hello(){
    return {
      text : 'Hello World!',
      views : 1245
    }
  }
};
````

---

#### app.js

- 이제, app.js 에서 graphQL 과 express app 을 연결시켜준다

````javascript
/** ===== app.js ===== */

const { graphqlHTTP } = require( 'express-graphql' );
const graphqlSchema = require( './graphql/schema' );
const graphqlResolver = require( './graphql/resolvers' );

/** post 요청으로 제한하지않고 모든 middleware 타입으로 넘겨준다 */
app.use( '/graphql' , graphqlHTTP( {
  schema : graphqlSchema,
  rootValue : graphqlResolver,
  graphiql : true,        // graphiql 툴 사용 http://localhost:8080/graphql 로 접근하여 테스트 할 수 있다
} ) );

````

- 또한 app.js 에서 graphQL 을 등록할때, { graphiql : true } 값을 입력해 두었다면,


- graphQL 을 등록한 url 로 이동하여 graphQL API 를 테스트해볼수도 있다
  - 위의 예시에서는 http://localhost:8080/graphql


- 해당 url 로 접근하여, 주석아래에 요청할 값들을 작성하고 play( run ) 버튼을 눌러 응답값을 체크할 수 있다

````shell
# 아래 형태로 작성하여 응답값을 왼쪽에서 바로 볼 수 있다

mutation{
  createUser( userInput:{ email :"test@test.com" , name :"Max" , password :"tester" } ) {
    _id
    email
  }
}
````

- 즉, PostMan 보다 테스트하기 용이하다.


- 자동완성이 지원되어, 상호작용이 가능하고, 오른쪽에 참고 DOC 를 지원하여 쉽게 테스트할 수 있다

---

#### frontend

- frontend 에서 이제 요청을 보낼때, app.js 에서 설정한 entryPoint 로 요청을 보내면,


- 요청 query 에 따라 응답을 반환해준다

````javascript
/** ========== frontend request ========== */
fetch( 'http://localhost:8080/graphql' , {
  method : 'POST',
  body : {
      /** 받고자 하는 데이터들을 콤마( , ) 없이 String 형식으로 나열  */
      query : "{ hello { text } }"
  }
} )
````

- 응답값은 아래와 같다

````json
{
  "data": {
    "hello": {
      "text": "Hello World!"
    }
  }
}
````

- 요청 query 에 필드를 추가할 경우

````javascript
/** ========== frontend request ========== */
fetch( 'http://localhost:8080/graphql' , {
  method : 'POST',
  body : {
      /** 받고자 하는 데이터들을 콤마( , ) 없이 String 형식으로 나열  */
      query : "{ hello { text views } }"
  }
} )
````

- 응답값은 아래와 같다

````json
{
  "data": {
    "hello": {
      "text": "Hello World!",
      "views": 1245
    }
  }
}
````

- 즉, 지금까지의 과정으로 frontend 에서 받고자하는 데이터를 filtering 하는 것이 아니라, express-graphql 에 의해


- 서버에서 받는 데이터가 필터링되어 들어온다
  - ( 응답데이터의 부담이 줄어든다! )

---

### Mutation 을 사용하여 데이터 응답

- 데이터를 요청시 반환하는 것 뿐만이 아니라, 
  - frontend 에서 데이터를 업데이트해야할 경우, 
  - Mutation 을 사용할 수 있다

---

#### schema.js

- type 선언시 queryName( paramName : paramType ) 형태로 입력하면, 요청시 입력한 파라미터를 입력할 수 있다 


- 사용자가 입력한 데이터 타입을 만들경우에는 type 키워드가 아닌, input 키워드를 사용한다


- 또한, GraphQL 타입 중 ID 타입은 GraphQL 이 제공하는 type 으로, ID 로 취급된다


- 기본 GraphQL built-in 타입이 아닌, 레퍼런스 타입들은( Object ,Array 등 ) 
  - 반드시 input, type 등으로 선언해줘야 한다

````javascript
/** ===== graphql/schema.js ===== */

/** Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의 */
const { buildSchema } = require( 'graphql' );

module.exports = buildSchema( `
    type Post {
        _id : ID!
        title : String!
        content : String!
        imageUrl : String!
        creator : User!
        createdAt : String!
        updatedAt : String!
    }

    type User {
        _id : ID!
        name : String!
        email : String!
        password : String
        status : String!
        posts : [Post!]!
    }

    input UserInputData {
        email : String!
        name : String!
        password : String!
    }
    
    type RootQuery {
        hello : String
    }

    type RootMutation {
        createUser( userInput : UserInputData ): User!
    }
    
    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );
````

---

#### resolver.js

- resolver 에서는 query 에 파라미터를 추가시, 파라미터를 받을 수 있다


- Schema 에 작성했던 parameter 타입과, response 타입을 통하여, 실제 사용자를 생성하는 로직을 작성한다

````javascript
/** ===== graphql/schema.js ===== */

const bcrypt = require( 'bcryptjs' );
const User = require( '../models/user' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
    /**
     * - Schema 에 정의했던 arguments 데이터들이 첫 번째 argument 에 들어온다
     *   ( 다수의 arguments 들을 입력할 수 있기 때문에, 첫번째 파라미터에 객체형태로 들어온다 )
     * */
    createUser : async function( { userInput } , req ){
        const existingUser = await User.findOne( { email : userInput.email } );

        /** 사용자가 존재할 경우 에러 생성 */
        if ( existingUser ){
            const error = new Error( 'User exists already!' );
            throw error;
        }

        /** password 를 암호화하고 저장한 후, 응답 값 반환 */
        const hashedPw = await bcrypt.hash( userInput.password , 12 );
        const user = new User( {
            email : userInput.email,
            name : userInput.name,
            password : hashedPw
        } );

        /** DB 에 사용자 저장 */
        const createdUser = await user.save();

        /**
         * - Schema 에 정의된 User 객체와 같은 type 을 반환하도록 한다
         *
         * - _doc 를 사용하면, Mongoose 가 추가한 메타데이터를 제외한 사용자가 입력한 데이터들만 반환한다
         */
        return {
            ...createdUser._doc,
            _id : createdUser._id.toString(),
        }
    }
};
````
