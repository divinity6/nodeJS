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