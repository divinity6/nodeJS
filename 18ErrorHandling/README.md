## ErrorHandling

- 에러 핸들링


- 에러가 반드시나쁜것은아니다( 오류를 알맞게 처리해주도록 하는것이 중요하다 )


- 서로 다른 에러를 처리하는 방법으로 내장된 Error 객체를 이용한다

---

- 아래의 코드의 경우에서 어떤이유로, session 에 user 가 저장되었지만, 중간에 DB 에서


- user 가 삭제되는등의 변수가 일어날 경우, 제대로 처리를 하지못하고 req.user 에 undefined 를 할당하게 된다


- 따라서, 이럴경우,  DB 에서 사용자를 가져온 후, 한번더 검증처리가 좋다

````javascript
/** ===== app.js ===== */
app.use( ( req , res , next ) => {
    if (!req.session.user) {
        return next(); 
    }
    User.findById( req.session.user._id )
        .then( user => {
            /** 요청 객체에 User 를 저장하여 어디서든 접근하여 쓸 수 있도록 저장 */
            req.user = user;
            console.log( '<<Request : saveUserInfo success>>' )
            next();
        } )
        .catch( err => console.log( '<<saveUserInfo Err>>' , err ) );
} );
````

- DB 에서 데이터를 가져온 후에도 검증 처리

````javascript
/** ===== app.js ===== */
User.findById( req.session.user._id )
    .then( user => {
        if ( !user ){
            return next();
        }
        /** 요청 객체에 User 를 저장하여 어디서든 접근하여 쓸 수 있도록 저장 */
        req.user = user;
        console.log( '<<Request : saveUserInfo success>>' )
        next();
    } )
    /** error 를 log 로 찍는것보단, Error 객체로 래핑하는것이 더 좋다 */
    .catch( err => {
        throw new Error( err );
    } );
````

---

- 또한, 네트워크 지연등 일시적인 에러가 존재할 경우, 


- catch 에서 단순하게 로그만 찍는것보다, 에러용 메시지를 전달해주거나, 에러페이지를 렌더링시켜주면된다

````javascript
/** ===== controllers/admin.js ===== */

/** mongoose 에서 save 메서드를 제공해준다 */
    product.save()
        .then( result => {
            console.log( '<<Created Product by Database>> :' , result );
            res.redirect( '/admin/products' );
        } )
        .catch( err => console.log( '<<AddDataFetchErr Occurred!>> :' , err ) );
````

- 에러발생시, 에러메시지를 추가하여 다시 렌더링 처리

````javascript
/** ===== controllers/admin.js ===== */

/** mongoose 에서 save 메서드를 제공해준다 */
    product.save()
        .then( result => {
            console.log( '<<Created Product by Database>> :' , result );
            res.redirect( '/admin/products' );
        } )
        .catch( err => {
            /**
             * - 단지, 에러 로그만 찍는 대신 아래처럼 에러처리를 하는 방법이 있다
             * --> 단순한 네트워크 지연문제등에는 아래처럼 처리할 수 있다
             */
            return res.status( 500 ).render( 'admin/edit-product' , {
                pageTitle : 'Add Product' ,
                path : "/admin/add-product",
                editing : false,
                hasError : true,
                product : { title , imageUrl , description , price },
                errorMessage : 'Database operation failed, please try again.',
                validationErrors : [],
            } );
        } );
````

---

- 또는, error 관련된 view 를 전역적으로 추가하여, 


- 에러 발생시 처리를 해당 view 로 전역적으로 처리해줄 수도 있다

````javascript
/** ===== controllers/admin.js ===== */

/** mongoose 에서 save 메서드를 제공해준다 */
    product.save()
        .then( result => {
            console.log( '<<Created Product by Database>> :' , result );
            res.redirect( '/admin/products' );
        } )
        .catch( err => {
            console.log( '<<AddDataFetchErr Occurred!>> :' , err );
            /** 에러 view 를 추가하여 해당 view 로 핸들링처리 */
            res.redirect( '/500' );
        } );
````

- controller 와 view 에 error 관련( 500 )처리를 추가해주면 된다

````javascript
/** ===== controllers/error.js ===== */
/**
 * - 500 error Controller
 */
exports.get500 = ( req , res , next ) => {
    res.status( 500 ).render( '500' , {
        pageTitle : 'Error!',
        path : '/500',
        isAuthenticated :  req.session.isLoggedIn
    } );
}
````

- 전역적인 Error 처리방식은 많은 앱에서 사용하는 일반적인 방식이다


- 그러나, 이렇게 모든 컨트롤러에서 error 발생시 redirect 를 시키게 되면( res.redirect( '/500' ) ) 코드가 매우 복잡해지며 많이 사용하지 않는다

````javascript
/** ===== controllers/admin.js ===== */
/** mongoose 에서 save 메서드를 제공해준다 */
product.save()
    .then( result => {
        console.log( '<<Created Product by Database>> :' , result );
        res.redirect( '/admin/products' );
    } )
    .catch( err => {
        const error = new Error( err );
        error.httpStatusCode = 500;
        return next( error );
    } );
````

- 이전에, expressJS 의 next 를 호출할때, 파라미터로 error 객체를 넘기게 되면, 중간의 모든 middleware 를 건너뛰고, 에러 처리 미들웨어에 전달되게 된다


- 에러처리 미들웨어는 다음과같이 4가지의 파라미터를 받는 함수로 선언하면 되는데, 이를 expressJS 에서 자동으로 감지해준다

````javascript
/** ===== app.js ===== */
/**
 * - error 처리 미들웨어( 4 개의 파라미터를 가진 미들웨어 )
 *
 * --> 제대로된 요청들은 전부 위에서 해결하기 때문에,
 *     해당 미들웨어에 도달하는 요청들은 전부 error 요청들이다
 *
 * --> 이곳에서 에러페이지로 리다이렉트시킨다
 */
app.use( ( error , req , res , next ) => {
    console.log( '<<Error redirect>>' , error );
    res.redirect( '/500' );
} );
````

- 또한 에러를 던질때, httpStatus 등으로 error 상태코드를 추가하거나,


- 추가정보를 전달하여, 실제 errorHandler 함수에서 에러에 따라 처리등을 다르게 할 수 도 있다

````javascript
/** ===== app.js ===== */
app.use( ( error , req , res , next ) => {
    /** 던지는 에러의 종류에 따라 다르게 렌더링등, 처리할 수 도 있다 */
    res.status( error.httpStatusCode ).render( ... )
} );
````

- 모든 에러처리시, 에러들을 에러처리 미들웨어로 던져서, 미들웨어에서 처리하도록하는것이 좋다


- 해당 미들웨어에서는 각 에러들을 받고 view 화면을 던져주게 하는 방법이 간단하고 직관적이다

---

- 주의해야할점은 비동기 환경에서 error 객체를 next 의 파라미터로 전달하지 않고 그냥 던지면 프로그람이 죽는다( expressJS 가 캐치하지 못한다 )
  - 그러나 동기환경에서는 catch 할 수 있다.
  - 그러나, next 의 파라미터로 넘기지 않고 throw 등으로 던지면, 에러 처리하는 미들웨어에서 res.redirect 등의 메서드를 사용하지 못한다는 단점이 있다


````javascript
/** ===== app.js ===== */
/**
 * - error 처리 미들웨어에서 redirect 를 사용하지 못하기 때문에, 직접 렌더링 시켜줘야 한다
 */
app.use( ( error , req , res , next ) => {
    console.log( '<<Error redirect>>' , error );
    res.status( 500 ).render( '500' , {
        pageTitle : 'Error!',
        path : '/500',
        isAuthenticated :  req.session.isLoggedIn
    } );
} );
````


- 즉, 아래 코드 처럼 비동기 환경에서는 throw new Error 로 에러를 던져도 되고,


- 동기환경에서는 next( new Error( err ) ) 로 에러를 던져야 한다

````javascript
/** ===== app.js ===== */
app.use( ( req , res , next ) => {
    throw new Error( 'Sync Dummy' );
    /**
     * - 모든 요청마다 session 에 저장된 user 를 이용해,
     *   user._id 를 이용하여 해당 사용자 데이터를 찾아 request 객체에 할당
     */
    User.findById( req.session.user._id )
        .then( user => {
            /** 더미 에러 생성 */
            throw new Error( 'Dummy' );

            if ( !user ){
                return next();
            }
            /** 요청 객체에 User 를 저장하여 어디서든 접근하여 쓸 수 있도록 저장 */
            req.user = user;
            console.log( '<<Request : saveUserInfo success>>' )
            next();
        } )
        /** error 를 log 로 찍는것보단, Error 객체로 래핑하는것이 더 좋다 */
        .catch( err => {
            // console.log( '<<saveUserInfo Err>>' , err )
            next( new Error( err ) );
        } );
} );
````

---

### Errors & Http Response Codes

- 상태코드를 통해 어떤 종류의 오류가 발생했는지 이해를 돕는다


- 200 , 20x 코드들은 항상 성공 상태코드이다
  - 200 : 일반적 성공
  - 201 : 서버에 성공적으로 리소스를 생성한 경우


- 3xx 상태코드는 리다이렉션,
  - 300 : 잠시 해당 소스가 리다이렉션
  - 301 : 영구적으로 해당 소스가 리다이렉션


- 4xx 상태코드는 클라이언트 오류관련 코드,
  - 401 : 인증되지 않음
  - 403 : 권한이 없음
  - 404 : 존재하지 않는 페이지
  - 422 : 유호하지 않은 입력

  
- 로그인 정보가 없을 경우, 401 로 인증되지 않는 코드를 발생시키고, 


- redirect 메서드가 호출되면 자동으로 300 코드로 status 가 덮어씌워진다

````javascript
/** ===== middleware/is-auth.js ===== */
module.exports = ( req , res , next ) => {
    /** 세션에 사용자가 로그인 했는지 정보 체크 */
    if ( !req.session.isLoggedIn ){
        /**
         * - 사용자가 로그인하지 않았으면 login 페이지로 리다이렉트 시킨다
         */
        return res.status( 401 ).redirect( '/login' );
    }
    next();
}
````

- 아래 코드를 통해 404 상태코드를 내보내게 되면, 크롬 브라우저 자체에서 존재하지 않는 페이지라고 인식할 수 있다
````javascript
/** ===== controllers/error.js ===== */
exports.get404 = ( req , res , next ) => {
  res.status( 404 ).render( '404' , {
    pageTitle : 'Page Not Found',
    path : '/404',
    isAuthenticated :  req.session.isLoggedIn
  } );
}
````


- 5xx 상태코드는 서버 측 오류 관련 코드,
  - 500 : 일반적인 서버에러



- 즉, 상태코드가 반드시 요청 실패나 앱의 충돌을 의미하지 않는다
  - ( 현재 문제가 있다는 정보를, 클라이언트에 문제정보를 보낼 뿐이다 )

---

### 사용가능한 상태 코드

- 1×× 정보전달
  - 100 Continue
  - 101 Switching Protocols
  - 102 Processing


- 2×× 성공
  - 200 OK
  - 201 Created
  - 202 Accepted
  - 203 Non-authoritative Information
  - 204 No Content
  - 205 Reset Content
  - 206 Partial Content
  - 207 Multi-Status
  - 208 Already Reported
  - 226 IM Used


- 3×× 리디렉션
  - 300 Multiple Choices
  - 301 Moved Permanently
  - 302 Found
  - 303 See Other
  - 304 Not Modified
  - 305 Use Proxy
  - 307 Temporary Redirect
  - 308 Permanent Redirect


- 4×× 클라이언트 오류
  - 400 Bad Request
  - 401 Unauthorized
  - 402 Payment Required
  - 403 Forbidden
  - 404 Not Found
  - 405 Method Not Allowed
  - 406 Not Acceptable
  - 407 Proxy Authentication Required
  - 408 Request Timeout
  - 409 Conflict
  - 410 Gone
  - 411 Length Required
  - 412 Precondition Failed
  - 413 Payload Too Large
  - 414 Request-URI Too Long
  - 415 Unsupported Media Type
  - 416 Requested Range Not Satisfiable
  - 417 Expectation Failed
  - 418 I'm a teapot
  - 421 Misdirected Request
  - 422 Unprocessable Entity
  - 423 Locked
  - 424 Failed Dependency
  - 426 Upgrade Required
  - 428 Precondition Required
  - 429 Too Many Requests
  - 431 Request Header Fields Too Large
  - 444 Connection Closed Without Response
  - 451 Unavailable For Legal Reasons
  - 499 Client Closed Request


- 5×× 서버 오류
  - 500 Internal Server Error
  - 501 Not Implemented
  - 502 Bad Gateway
  - 503 Service Unavailable
  - 504 Gateway Timeout
  - 505 HTTP Version Not Supported
  - 506 Variant Also Negotiates
  - 507 Insufficient Storage
  - 508 Loop Detected
  - 510 Not Extended
  - 511 Network Authentication Required
  - 599 Network Connect Timeout Error


- 출처: https://httpstatuses.com/

---

### Module Summary

- 어플리케이션에서 throw 키워드를 통해 직접 에러를 던질 수 있고,


- expressJS 에서 해당 에러를 캐치할 수 도 있다
  - ( try-catch , then-catch )


- 또한, 에러를 던지고나서 전역 error 미들웨어에서 해당 에러를 처리할 수 있다


- 반드시 적절한 상태코드를 반환하게되면, 브라우저에 구체적인 문제점을 알릴 수 있고, 앱이 더욱 견고해진 

---

### Express.js의 오류 처리법

- 공식 참고자료: Docs: https://expressjs.com/en/guide/error-handling.html