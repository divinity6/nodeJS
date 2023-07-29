## Auth

- Authentication( 인증 )이 무엇인가
  - 다른 언어나 프레임워크에서도 인증은 같은 방식으로 이루어진다
  - 자격증명을 저장하고 활용하는 방법
  - 라우트 접근을 차단하는 방법( 서버측 권한 체크 )

---

### What is Authentication?

- 인증이란 무엇인가


- 인증에서 중요한것은 해당 어플리케이션 사용자가 모든 액션을 사용할 수 있는것이 아니라는 것이다
  - 사용자 : 로그인을 마친사용자가 아닌, 단순히 페이지를 방문하는 사람


- 로그인하지 않은 사용자가 사용할 수 없는 액션들이 존재한다


- 로그인하지 않은 익명의 사용자와 로그인한 사용자를 구별할 수 있어야 한다

---

### How is Authentication Implemented?

- 보통 사용자가 서버에 로그인 요청을 보낸다


- 서버에서는 해당 사용자정보의 validation 체크를 수행한후, 데이터베이스에서 체크한다


- 해당 사용자가 존재한다면, Session 을 생성하고, 세션에서 사용자를 저장하게 된다


- 세션이 없다면, 자격증명이 유효하다 해도, 요청후 다음 요청에 바로 로그아웃 될 것이다
  - ( 요청이 단독적으로 실행되어 다음 요청을 알지 못하기 때문에 세션을 통해 요청을 연결한다 )
  - 따라서, 사용자나 인증 정보에 대한 세션을 생성해야 한다


- 이후, 200 성공 응답을 보내며, 세션과 함께 응답 Cookie 를 클라이언트에 저장하면 세션이 구축된다


- 그후, 사용자가 제한된 라우트에도 방문할 수 있게 된다. 


- 모든 요청과 쿠키가 함께 발송되는데, 서버에서 쿠키와 세션을 연결해 세션에서 사용자 로그인 여부를 확인할 수 있다


- 이 방식이 세션에 기반한 인증방식이다


---

### Auth flow

- 사용자가 이메일등을 입력했을때, MongoDB 에서 해당 이메일 형식을 가지고 있는지 체크해야한다


- 따라서, DB 에서 이메일데이터들을 전부 가져온다음 체크 후 해당 데이터에 존재한다면, 회원 가입을 거부하면 된다


- 해당 validation 을 체크한 후, 유효하다면 새로운 사용자를 생성해 로그인 시키면 된다

---

- 또한, 현재 상태의 사용자의 비밀번호는 암호화되지 않은 상태로, 해당 사용자의 비밀번호를 암호화해서 저장해야 한다


- 이때, hash 암호화 하는 라이브러리가 bcryptjs 이다

````shell
npm i bcryptjs
````

- 그 후, bcryptjs 의 hash 함수를 이용하여 비밀번호를 암호화( hashing )처리등을 할 수 있다


- 해당 hash 함수는 해싱처리된( 암호화된 ) Promise<string> 객체를 반환한다


- 그 후 로그인시 로그인 사용자의 이메일과 비밀번호를 추출하여 비교한다

````javascript

const bcript = require( 'bcryptjs' );

exports.postSignup = (req, res, next) => {
  const { email , password , confirmPassword } = req.body;
  User.findOne( { email } )
      .then( userDoc => {
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
        return bcript.hash( password , 12 );
      });
};
````

- 암호화해서 비밀번호 데이터를 저장하게 되면, **bcript 로 암호화한 데이터는 되돌릴 수 없다**


- 따라서, hashing 처리한 값과 패스워드 값이 같은 값인지 체크할 수 있는 메서드를 제공하는데,


- 해당 메서드를 이용하여 같은 값인지 비교할 수 있다

````javascript
const bcript = require( 'bcryptjs' );

exports.postLogin = ( req , res , next ) => {
  const { email , password } = req.body;

  /** 로그인시 사용한 email 과 매치되는 유저를 찾음 */
  User.findOne( { email } )
    .then( user => {
      /**
       * - 첫 번째 파라미터로 암호화되지 않은 string 을 사용하고,
       *
       * - 두 번째 파라미터로 암호화된 string 을 사용한다
       *
       * @return { Promise<boolean> } - 같은 값인지 체크 여부를 반환한다
       */
      bcript
        .compare( password , user.password )
        .then( doMatch => {
          /** password 가 일치할 경우에만 세션에 login 데이터 설정 및 / 로 리다이렉트 */
          if ( doMatch ){
            req.session.isLoggedIn = true;
            req.session.user = user;
            /** 더이상 아래코드가 실행되지 못하도록 return! */
            return req.session.save( ( err ) =>{
              console.log( '<<saveUserInfo Session success>>' , err );
              return res.redirect( '/' );
            } );

          }
          res.redirect( '/login' );
        } )
        .catch( err => {
          console.log( '<<postLoginCompareErr>>' , err );
          res.redirect( '/login' );
        } )
    } )
}

````

- 즉, 올바른 이메일과 비밀번호를 입력해야 서버에 세션이 생성되고, 로그인기능을 할 수 있다

---

### Protect Route

- 각 페이지에 접근할때, 해당 사용자의 권한이 있는지 체크해야하는데


- 각 라우트에서 session.isLoggedIn 을 일일히 체크하는 것은 매우번거롭고, 


- 개발자의 실수가 잦을 가능성이 높은 일이다


- 따라서, 이럴 경우 middleware 를 두어 이곳에서 공통으로 체크하는것이 효율적이고 안전하다

````javascript
/** ===== middleware/is-auth.js ===== */
module.exports = ( req , res , next ) => {
    /** 세션에 사용자가 로그인 했는지 정보 체크 */
    if ( !req.session.isLoggedIn ){
        /**
         * - 사용자가 로그인하지 않았으면 login 페이지로 리다이렉트 시킨다
         */
        return res.redirect( '/login' );
    }
    next();
}
````

- 해당 미들웨어를 작성한 후, 원하는 라우트에 등록할 수 있는데, **라우터 객체는 등록한 callback 순서대로 실행된다**

````javascript
/** ===== routes/admin.js ===== */
const express = require( 'express' );
const isAuth = require( '../middleware/is-auth' );
const adminController = require( '../controllers/admin' );
const router = express.Router();

// /admin/add-product => GET
router.get( '/add-product' , isAuth , adminController.getAddProduct );
````

- 위의 방식으로 인증되지 않은 라우트 접근을 보호할 수 있다