## Validation

- 검증 이해


- 사용자 입력 유효성 검사

---

### Why Validate?

- 유효성 검사가 왜 중요한가?


- 해당 유효성 검사를 어떻게 구현할 수 있는가?


- 즉, 처리할 데이터가 원하는 형식의 데이터인지 검사하는 것


- validation 체크가 없다면, 유효하지 않은 이메일로 로그인을 시도 하더라도 허용된다
  - ( 사용자가 잘못된 정보를 입력하는 것을 막지 않고 있다 )
  - 이럴경우 Controller/Middleware 즉, 데이터베이스에 저장하기 직전에 유효성 검사단계를 추가한다

---

### How to Validate

- 사용자 입력의 유효성을 어떻게 검사하는가?


- JS 로 클라이언트에서만 유효성검사를 한다면, 사용자가 임의로 JS 를 끌 수 있기 때문에,


- 잘못된 데이터가 서버에 오는것을 막아주는 보호 기능이라고 할 수 없다


- 단지, 클라이언트의 유효성 검사는 사용자 경험과 관련되어 있고, 안전하다고는 볼 수 없다


- 서버사이드로 진행할 경우에는 사용자가 임의로 끌 수 없기 때문에, 안전하다고 볼 수 있다


- 거의 대부분의 DB 에는 Built-in Validation 체크 기능이 존재하지만, 이는 옵션이다


- 그러나 Server 자체에서 Validation 체크는 반드시 진행해줘야한다


---

### express-validator

- validation 체크를 도와주는 라이브러리

````shell
npm i --save express-validator
````

- 설치 후 사용할 패키지들 import


- 라우트에 제공하는 함수들을 등록하면, 함수들은 express-validator 의 체인 객체를 반환하는데,


- 해당 체인 객체는 route 에서 실행가능한 미들웨어들을 반환하는 메서드들을 포함하고 있


- 예시 : 이메일의 유효성을 검사하는 로직
  - 이메일의 유효성을 검사해 해당 값이 존재하는지 체크하고, 미들웨어를 반환한다


````javascript
/** ===== routes/auth.js ===== */
const { check } = require( 'express-validator' );

/**
 *
 * --> 파라미터 에 view 에서 전송하는 데이터 필드의 이름을 입력
 *
 * --> email 값 확인 , 유효성을 검사하려는 것을 알림
 *    ( 들어오는 req 의 email 필드 검사,
 *      body , query , header , cookie 에서 해당 필드 값( 첫 번째 파라미터 )을 찾음 )
 *      
 * --> check( 'email' ).isEmail() 미들웨어에서는 에러를 수집하여 다음 미들웨어의 req 에 담아 보낸다
 */
router.post('/signup', check( 'email' ).isEmail() , authController.postSignup );
````

- 만약, route 의 express-validator 미들웨어에서 에러가 발생했다면, 해당 에러를 모아 저장하는데, 


- express-validator 패키지의 validationResult 함수안에 들어있다


- 따라서, errors 상수를 이용하여 오류가 존재하는지 체크할 수 있다

````javascript
/** ===== controllers/auth.js ===== */
const { validationResult } = require( 'express-validator' );

exports.postSignup = (req, res, next) => {
  const { email , password , confirmPassword } = req.body;
  /**
   * - express-validator 미들웨어에서 발생한 에러를 모아주어, errors 변수에저장
   * */
  const errors = validationResult( req );
  /** 에러가 존재하는지 여부를 반환하는 메서드 - 에러가 존재할 시 에러코드 반환 */
  if ( !errors.isEmpty() ){
    /** 에러 코드를 반환하고, signup 페이지를 다시 렌더링한다 */
    console.log( '<< postSignup validator errors.array() >> :' , errors.array() );
    return res.status( 422 ).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage : errors.array(),
    });
  }
}
````

- form 태그에 내부 input 태그등을 기본 브라우저 validation 체크기능을 


- 끌 수 있는 키워드등을 제공하는데, 클라이언트에서 제공하는 좋은 검사이므로 기본적으로는 추가하는 것이 좋다

````html
<form novalidate>
</form>
````

- errors.array() 객체에 들어오는 배열 값을 보면, 어떤 값에 어떤 유효성 검사를 실패했고, 


- express-validator 미들웨어가 어떤 알림등을 생성했는지 파악할 수 있다

````javascript
/** errors.array() 결과값 */
[
  {
    type: 'field',
    value: 'test',
    msg: 'Invalid value',
    path: 'email',
    location: 'body'
  }
]

````