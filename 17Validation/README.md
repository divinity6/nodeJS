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
 * 
 * --> withMessage() 를 통하여, email 이 실패할 경우 어떤 메시지를 담을지 설정할 수 있다
 */
router.post('/signup', check( 'email' ).isEmail().withMessage( 'Please enter a valid email.' ) , authController.postSignup );
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

### express-validator


- [ validator.js ](https://github.com/validatorjs/validator.js)
  - validator.js 라이브러리 너무 좋은데...?
  - 모든 개발에 기본적으로 사용할 수 있을듯...?


- 또한, 기본적으로 express-validator 에는 사용자지정 validator 를 추가할 수 있다


- email 뿐만아니라, 사용자가 직접 검증자를 추가하여 원하는 에러메시지등을 자유롭게 커스텀할 수 있는 메서드를 제공한다

````javascript
/** ===== routes/auth.js ===== */
const { check } = require( 'express-validator' );
/**
 *
 * --> 파라미터 에 view 에서 전송하는 데이터 필드의 이름을 입력
 *
 * --> email 값 확인 , 유효성을 검사하려는 것을 알림
 *    ( 들어오는 req 의 email 필드 검사,
 *      body , query , header , cookie 에서 해당 필드 값( 첫 번째 파라미터 )을 찾음 )에
 *
 * --> check( 'email' ).isEmail() 미들웨어에서는 에러를 수집하여 다음 미들웨어의 req 에 담아 보낸다
 *
 * --> withMessage() 를 통하여, email 이 실패할 경우 어떤 메시지를 담을지 설정할 수 있다
 * */
router.post(
        '/signup',
        check( 'email' )
                .isEmail()
                .withMessage( 'Please enter a valid email.' )
                /**
                 * - 사용자지정 custom 에러 생성가능
                 * --> 즉, email 뿐만 아니라, 특정 에러등도 커스텀해 추가할 수 있다
                 *
                 * - 즉, 사용자 검증자를 추가할 수 있다
                 * */
                .custom( ( value , { req } ) => {
                  if ( 'test@test.com' === value ){
                    throw new Error( 'This email address if forbidden.' )
                  }
                  return true;
                } ) ,
        authController.postSignup );

````

### password-validator

- 또한, 배열을 이용해 다중으로 validator 를 등록할 수 있으며,


- check 함수로 모든 요청을 검증하는것이 아니라, body , cookie , param , query 등


- 요청의 특정 property 에 대해서만도 검증할 수 있다
  - check 는 모든 요청의 header , body 등 전부 검사한다


- 또한, 특정한 validation 마다 errorMessage 를 따로 줄 수 있다


- 배열에 등록한 validator 순서대로 처음부터 순회하며 값들을 검증한다

````javascript
/**
 * - check 로 모든 req 뿐 아니라, body , cookie , param ,query 등
 *   들어오는 req 중에서 특정 기능들만도 확인할 수 있다
 */
const { check , body } = require( 'express-validator' );

/**
 *
 * --> 파라미터 에 view 에서 전송하는 데이터 필드의 이름을 입력
 *
 * --> email 값 확인 , 유효성을 검사하려는 것을 알림
 *    ( 들어오는 req 의 email 필드 검사,
 *      body , query , header , cookie 에서 해당 필드 값( 첫 번째 파라미터 )을 찾음 )에
 *
 * --> check( 'email' ).isEmail() 미들웨어에서는 에러를 수집하여 다음 미들웨어의 req 에 담아 보낸다
 *
 * --> withMessage() 를 통하여, email 이 실패할 경우 어떤 메시지를 담을지 설정할 수 있다
 * */
router.post(
        '/signup',
        [
          check( 'email' )
                  .isEmail()
                  .withMessage( 'Please enter a valid email.' )
                  /**
                   * - 사용자지정 custom 에러 생성가능
                   * --> 즉, email 뿐만 아니라, 특정 에러등도 커스텀해 추가할 수 있다
                   *
                   * - 즉, 사용자 검증자를 추가할 수 있다
                   * */
                  .custom( ( value , { req } ) => {
                    if ( 'test@test.com' === value ){
                      throw new Error( 'This email address if forbidden.' )
                    }
                    return true;
                  } ),
          /**
           * - 들어온 요청의 body 의 password 필드는,
           *
           * - 반드시 5 문자열 이상( isLength )이어야하고,
           *   숫자와 일반문자( isAlphanumeric )들만 허용한다
           *
           * - 특정한 validation 마다 뒤에 withMessage 메서드를 추가하여,
           *   해당 validation 의 검증에 대한 메시지를 보낼 수도 있지만,
           *
           *   일괄적으로 2번째 파라미터에 기본 메시지를 생성할 수도 있다
           */
          body( 'password' , 'Please enter a password with only numbers and text and least 5 characters.' )
                  .isLength( { min : 5 } )
                  .isAlphanumeric()
        ] ,
        authController.postSignup );

````

### confirm-password-validator

- 동일한 비밀번호인지 체크할때는, 사용자 지정 custom 메서드를 이용하여 검증할 수 있다


- 배열에 작성한 순서대로 검증하므로, password 에서 이미 길이, 숫자영문자 여부등을 검사하였기때문에,


- confirmPassword validator 에서는 굳이 해당 검증을 수행할 필요가 없다
  - ( 단지 같은지만 체크하면 된다 )

````javascript
/**
 * - check 로 모든 req 뿐 아니라, body , cookie , param ,query 등
 *   들어오는 req 중에서 특정 기능들만도 확인할 수 있다
 */
const { check , body } = require( 'express-validator' );

/**
 *
 * --> 파라미터 에 view 에서 전송하는 데이터 필드의 이름을 입력
 *
 * --> email 값 확인 , 유효성을 검사하려는 것을 알림
 *    ( 들어오는 req 의 email 필드 검사,
 *      body , query , header , cookie 에서 해당 필드 값( 첫 번째 파라미터 )을 찾음 )에
 *
 * --> check( 'email' ).isEmail() 미들웨어에서는 에러를 수집하여 다음 미들웨어의 req 에 담아 보낸다
 *
 * --> withMessage() 를 통하여, email 이 실패할 경우 어떤 메시지를 담을지 설정할 수 있다
 * */
router.post(
        '/signup',
        [
          check( 'email' )
                  .isEmail()
                  .withMessage( 'Please enter a valid email.' )
                  /**
                   * - 사용자지정 custom 에러 생성가능
                   * --> 즉, email 뿐만 아니라, 특정 에러등도 커스텀해 추가할 수 있다
                   *
                   * - 즉, 사용자 검증자를 추가할 수 있다
                   * */
                  .custom( ( value , { req } ) => {
                    if ( 'test@test.com' === value ){
                      throw new Error( 'This email address if forbidden.' )
                    }
                    return true;
                  } ),
          /**
           * - 들어온 요청의 body 의 password 필드는,
           *
           * - 반드시 5 문자열 이상( isLength )이어야하고,
           *   숫자와 일반문자( isAlphanumeric )들만 허용한다
           *
           * - 특정한 validation 마다 뒤에 withMessage 메서드를 추가하여,
           *   해당 validation 의 검증에 대한 메시지를 보낼 수도 있지만,
           *
           *   일괄적으로 2번째 파라미터에 기본 메시지를 생성할 수도 있다
           */
          body( 'password' , 'Please enter a password with only numbers and text and least 5 characters.' )
                  .isLength( { min : 5 } )
                  .isAlphanumeric(),
          /** 해당 password 가 동일한지 검증하는 메서드 */
          body( 'confirmPassword' ).custom( ( value , { req } ) => {
            if ( value !== req.body.password ){
              throw new Error( 'Passwords have to match!' );
            }
            return true;
          } )
        ] ,
        authController.postSignup );

````

---

### duplicated-email-validator

- 현재까지는 email 중복 검증을 auth controller 에서 처리하고 있었다
  - ( 논리적으로는 유효성 검증의 일부로 반드시 체크해야한다 )


- 이 검증을 routes 의 express-validator 에서 처리도록 변경한다, email 을 검증하려면, 


- DB 에서 user 를 조회해야 하기 때문에 비동기 처리를 하게 된다


- express-validator 에서 사용자지정 custom 메서드는 true , false , error , promise 객체들을 반환할 수 있는데,


- false , error , Promise.reject 가 발생한경우 해당 validate 검증이 실패한 것으로 처리한다


- 또한, Promise 를 반환할경우, express-validator 는 해당 Promise 를 await 한 후 뒤의 validator 를 처리한다

````javascript
/**
 * - check 로 모든 req 뿐 아니라, body , cookie , param ,query 등
 *   들어오는 req 중에서 특정 기능들만도 확인할 수 있다
 */
const { check , body } = require( 'express-validator' );

/**
 *
 * --> 파라미터 에 view 에서 전송하는 데이터 필드의 이름을 입력
 *
 * --> email 값 확인 , 유효성을 검사하려는 것을 알림
 *    ( 들어오는 req 의 email 필드 검사,
 *      body , query , header , cookie 에서 해당 필드 값( 첫 번째 파라미터 )을 찾음 )에
 *
 * --> check( 'email' ).isEmail() 미들웨어에서는 에러를 수집하여 다음 미들웨어의 req 에 담아 보낸다
 *
 * --> withMessage() 를 통하여, email 이 실패할 경우 어떤 메시지를 담을지 설정할 수 있다
 * */
router.post(
        '/signup',
        [
          check( 'email' )
                  .isEmail()
                  .withMessage( '다Please enter a valid email.' )
                  /**
                   * - 사용자지정 custom 에러 생성가능
                   * --> 즉, email 뿐만 아니라, 특정 에러등도 커스텀해 추가할 수 있다
                   *
                   * - 즉, 사용자 검증자를 추가할 수 있다
                   *
                   * - custom validator 는 true , false ,error ,promise 객체를 반환할 수 있다
                   */
                  .custom( ( value , { req } ) => {

                    return User.findOne( { email } )
                            .then( userDoc => {
                              /**
                               * - 해당 email 을 가진 사용자가 있다면,
                               *   해당 사용자를 생성하지 말아야 한다
                               */
                              if (userDoc) {
                                return Promise.reject( 'E-Mail exists already, please pick a different one.' );
                              }
                            } );
                  } ),
          /**
           * - 들어온 요청의 body 의 password 필드는,
           *
           * - 반드시 5 문자열 이상( isLength )이어야하고,
           *   숫자와 일반문자( isAlphanumeric )들만 허용한다
           *
           * - 특정한 validation 마다 뒤에 withMessage 메서드를 추가하여,
           *   해당 validation 의 검증에 대한 메시지를 보낼 수도 있지만,
           *
           *   일괄적으로 2번째 파라미터에 기본 메시지를 생성할 수도 있다
           */
          body( 'password' , 'Please enter a password with only numbers and text and least 5 characters.' )
                  .isLength( { min : 5 } )
                  .isAlphanumeric(),
          /** 해당 password 가 동일한지 검증하는 메서드 */
          body( 'confirmPassword' ).custom( ( value , { req } ) => {
            if ( value !== req.body.password ){
              throw new Error( 'Passwords have to match!' );
            }
            return true;
          } )
        ] ,
        authController.postSignup );
````