## Session And Cookie

- 메모리 or 브라우저에 데이터를 저장하는 메커니즘


- 세션과 쿠키는 웹 개발에서 중요한 구조체와 기술이다


### What is Cookies?

- frontend 에서 서버에 요청을 보낸다
  - ( 이 요청에 따라, 브라우저에 일정 데이터를 저장해야한다 )


- 예를들어, 사용자가 로그인했을 경우, 
  - 로그인 정보를 어딘가에 저장해서 페이지가 새로고침 되어, 
  - 새로운 요청이 보내졌더라도 같은 사용자가 로그인 된 상태라는 정보를 가져야한다
  - ( 즉, 요청에 대한 응답과 함께 쿠키를 보내게 된다 )
  - 사용자가 로그인 데이터를 제출하면, redirect 할 view 외에도 cookie 를 포함하는 것이다


- 여기서 cookie 는 사용자가 인증을 마쳤다는 정보를 저장하고 있다
  - 이 정보를 frontend 환경에 저장해서, 이어지는 요청들에도 cookie 를 포함하여,
  - 쿠키에 저장된 데이터도 함께 보내게 된다( 서버에 로그인한 정보등 )


### save request by LoginInfo

- 사용자가 로그인했다는 정보를 request 객체에 저장해서, 인증정보를 사용하려 한다
  - 그런데, 하나의 request 안에서 해당 정보를 저장하는데,
  - 아래와 같은 코드는 redirect 시점에서 loggedIn 정보를 저장한 request 가 끝나기 때문에,
  - **/ 로 리다이렉트하면, 다시 / 에 대한 새로운 request 를 생성해, isLoggedIn 정보가 업데이트되지 않는다**

````javascript
/** ===== controller/auth.js ===== */
/**
 * - post Login
 *
 * --> 로그인 정보 요청 controller
 *
 * @param req
 * @param res
 * @param next
 */
exports.postLogin = ( req , res , next ) => {
  /** 로그인 정보를 req 객체에 저장 */
  req.isLoggedIn = true;
  res.redirect( '/' );

}
````

- 즉, 리다이렉트되면 새로운 request 로 실행된다는것을 꼭 기억해야한다
  - ( 생각해보면 당연한거임, 해당 route 를 다시탈테니깐... )


- 즉, 모든 요청마다 해당 데이터를 공유하면 안되기때문에 당연한것이다
  - ( 모든사람이 로그인권한을 얻는다면 말이 안되기 때문 )


- 같은 IP 주소로부터 요청이 비롯되었다고해도, 각 요청이 따로 처리된다

### How to solve?

#### 모든 요청전에 값을 할당하기

- 어찌되었건, 모든 요청간에 해당 데이터가 있는지 확인하려면, route 를 이용하기전 미들웨어에서 전처리를 해줘야한다


- route 가 실행되기 전에, 해당 미들웨어를 실행하여 저장하는 방식이다

````javascript
/** ===== app.js ===== */
app.use( ( req , res , next ) => {
  User.findById( '64b28d5af6522c01b9d0884d' )
          .then( user => {
            /** 요청 객체에 User 를 저장하여 어디서든 접근하여 쓸 수 있도록 저장 */
            req.user = user;
            console.log( '<<saveUserInfo success>>' )
            next();
          } )
          .catch( err => console.log( '<<saveUserInfo Err>>' , err ) );
} );
````

#### 글로벌 변수사용하기

- 글로벌 변수를 파일에 저장해 사용한다면, 요청 주기와 관계없이 계속 사용할 수 있다


- 그러나, 이런 글로벌 변수는 모든 요청에서 공유되기 때문에, 


- 요청 뿐아니라 사용자간에도 공유되며, 이때 쿠키가 유용하게 쓰인다

#### 쿠키 이용하기

- 사용자의 브라우저에 데이터를 저장해 사용한다면, 해당 사용자에 맞춤되어 데이터가 사용되기때문에,


- 다른 사용자에 영향을 끼치지 못한다
  - ( 또한, 쿠키는 요청과 함께 보내지면서, 사용자가 이미 인증되었다고 알려준다 )


- 아래처럼 저장하는 쿠키는 **세션쿠키이기 때문에 브라우저를 끄면 만료**된다


- 또한 이제 요청을 보낼때마다 브라우저가 디폴트로 서버에 쿠키를 보내게 된다

````javascript
/** ===== controller/auth.js ===== */
/**
 * - post Login
 *
 * --> 로그인 정보 요청 controller
 *
 * @param req
 * @param res
 * @param next
 */
exports.postLogin = ( req , res , next ) => {
  /**
   * - response header 에 설정
   *
   * --> Set-Cookie : cookie 에 값을 설정한다는 예약어
   * --> 데이터는 key=value 페어를 사용한다
   */
  res.setHeader( 'Set-Cookie' , 'loggedIn=true' );
  res.redirect( '/' );

}
````

- 또한, 서버에서 request 객체의 get 메서드를 이용해 header 값을 가져올 수 있다

````javascript
req.get( 'Cookie' );
````

- 즉, 쿠키에 데이터를 저장하면 요청간 데이터를 저장할 수 있다


- 브라우저내의 쿠키는 사용자가 조작할 수 있기 때문에, 민감한 데이터는 브라우저에 저장해서는 안된다


- 쿠키가 요청간 데이터를 저장함에 있어 유용하지만, 모든 경우에 최상의 접근으로 볼 수 없다
  - ( **브라우저에서 쿠키를 조작할 수 있기 때문에 세션의 도움을 받아야한다** )


- 쿠키는 조작될 수 있기 때문에 민감한 데이터를 저장하는건 바람직하지 않지만, 사용자 추적에 자주 사용되는 이유가 있다


- 쿠키는 다른 페이지로 전달될 수도 있기때문에, 해당 웹사이트에 <img src=""/> 태그등으로


- 우리서버 위치를 작성하게 된다면, 해당 웹사이트의 쿠키를 가져올 수 있다


- HttpOnly 를 사용하면 XSS( Cross Site Scripting )을 방지할 수 있다
  - ( JS 로 Cookie 에 접근하지 못하도록 설정하기 때문 )

````javascript
/**
 * - response header 에 설정
 *
 * --> Set-Cookie : cookie 에 값을 설정한다는 예약어
 * --> 데이터는 key=value 페어를 사용한다
 *
 * --> 다른값을 추가로 입력하고 싶을 경우에는 ;후 작성한다
 * --> Expires= , Max-Age= 등은 Http 에서 지원하는 값들이므로, 해당형식을 따라야한다
 *
 * --> Secure --> HTTPS 를 통해 페이지를 접근 및 제공할때만 cookie 가 설정된다
 * --> HttpOnly --> 클라이언트, 즉, JS 로 Cookie 에 접근할 수 없도록 설정
 */
res.setHeader( 'Set-Cookie' , 'loggedIn=true; HttpOnly');

}
````

---

### What is Session?

- 세션은 사용자가 frontend( View )를 사용하고, 


- View 는 Server 와 상호작용하며, 요청을 전송하고 로그인을 진행한다


- 로그인을 진행할때, 사용자가 인증되었다는 정보를 frontend 인 Cookie 에 저장하는대신, 


- Session 이라는 backend 공간에 저장한( 요청에 저장한다는 의미가 아니다 )


- Express 앱의 어느 변수에도 저장하지 않는다( 모든 사용자 요청에 공유될 것이기 때문 )


- **동일한 사용자가 보낸 모든요청에 정보를 공유하는것이 중요한 포인트**이다


- 세션 저장소에 저장 후 조만간 데이터베이스로 이동할 것이다


- 이때, 클라이언트( frontend )는 서버에 자신이 소속된 Session 을 알려줘야하는데,


- **Session은 단순히 메모리 or 데이터베이스에 저장된 입력값**에 불과하기 때문이다


- Session 정보를 알려주는 역할로 Cookie 를 사용한다( 이때 hashID 를 이용한다 )


- 즉, 저장된 Cookie 값이 데이터베이스의 ID 값과 관련되어 있다는 서버측에서만 확인할 수 있도록 한다


- 핵심개념은 **Session 에 중요한 기밀 데이터를 저장하게되고, CookieID 값으로 일치시키는 것**이다
  - 브라우저내부에서는 변경하거나 접근할 수 없기 때문....
  - Cookie 값을 변경하더라도 Session hashID 값과 맞아야 하기 때문!


- Cookie : **ClientSide**
- Session : **ServerSide**

---

### How to use?

- 제 3자 패키지를 통해 세션을 설치하고 서버를 시작하는 시점에 세션을 초기화한다

````shell
npm i --save express-session
````

- 패키지를 설치하고, 미들웨어를 등록할때, 초기에 등록해주는게 좋다
  - 모든 요청전에 실행되어야하므로...

````javascript
const express = require( 'express' );
const session = require( 'express-session' );
const app = express();
/** route 요청전에 미들웨어 등록 */
/**
 * - 세션 설정
 * @param { string } secret - 식별 ID 를 Cookie 에 암호화( hash )해 등록할때 사용한다
 * @param { boolean } resave - 모든 요청마다 session 에 저장하는것이 아니라, session 이 변경되었을 경우에만,
 *                             저장하도록 한다 ( 성능 개선 )
 * @param { boolean } saveUninitialized - 저장할 필요가 없는 요청의 경우, 어떤 세션도 저장되지 않게 한다
 * @param { { [ key : string ] : any } } cookie? - 세션 쿠키를 설정할 수 있다
 */
app.use( session( {
  secret : 'my secret',
  resave : false,
  saveUninitialized : false,
} ) );

````