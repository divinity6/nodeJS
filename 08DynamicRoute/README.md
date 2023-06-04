## DynamicRoutes & Advanced Models

- 라우트에 동적 데이터를 전달


- 동적 라우팅

````javascript
/** 동적 라우트 추가 - : 뒤에 작성 */
router.get( '/products/:productId' , ( req , res , next ) =>{
    /**
     * - 동적 라우트 Id 는 req 의 params 로 접근해 가져올 수 있다
     */
    console.log( req.params.productId );
} );

````

- include 시 2번째 파라미터로 해당 데이터를 전달할 수 있다

````ejs
<%- include( '../includes/add-to-cart.ejs' , { product : product } ) %>
````

- 라우트 공식 참고자료:https ://expressjs.com/en/guide/routing.html