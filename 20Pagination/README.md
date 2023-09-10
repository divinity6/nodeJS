## Pagination

- 현재는 제품 페이지를 표시할때, 항상 모든 제품을 가져오고 있었다


- 데이터를 다수의 페이지에 걸쳐 분할하며, 많은 데이터를 다룰때 사용하는 일반적인 방법


### 페이지 컨트롤 기능


- 페이지네이션 버튼을 클릭할때마다 쿼리에 해당 페이지 값 추가

````html
<!-- ===== app.js ===== -->
<section class="pagination">
    <a href="/?page=1">1</a>
    <a href="/?page=2">2</a>
</section>
````

- 해당 페이지를 렌더링하는 컨트롤러에서 해당 쿼리값을 가져와서,


- ( 현재 페이지 - 1 ) * 보여줄 제품 수 를 계산한다음


- 해당 값만큼 건너뛰고, 보여줄 제품 수 만큼 DB 에서 제품을 가져오면 된다


````javascript
/** ===== controller/shop.js ===== */
/** 몇개의 제품을 가져올 것인지 설정하는 상수 */
const ITEMS_PER_PAGE = 2;

/**
 * - index Controller
 * @param req
 * @param res
 * @param next
 */
exports.getIndex = ( req , res , next ) => {
    /** page 쿼리에 접근 */
    const page = Number( req.query.page ) || 1;

    Product.find()
        /**
         * - skip 메서드를 추가하면,
         *   find 로 찾은 결과중 첫 번째부터 skip 갯수만큼 생략한다
         */
        .skip( ( page - 1 ) * ITEMS_PER_PAGE )
        /**
         * - limit 메서드는 find 로 가져오는 데이터양을 지정할 수 있다
         */
        .limit( ITEMS_PER_PAGE )
        .then( products => { ... } )
}
````

- MySQL 사용시에는 아래를 살펴보면된다


- [ SQL 코드 페이지화(pagination) ]( https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging )


- LIMIT 명령어를 사용해 가져오는 데이터의 양을 제한. 


- OFFSET 명령어(skip() 대체)와 함께 사용해, 가져오는 항목의 개수와 생략하는 항목의 개수 지정


- [ Sequelize 사용 시 ]( https://sequelize.org/master/manual/model-querying-basics.html )

---

### Pagination

- 먼저 DB 에서 총 제품의 갯수를 가져온다음, 몇번째 제품부터 몇개의 제품을 가져올지를 설정하고 view 에 던진다


- **다음 페이지 존재여부** : 총 제품의 갯수보다 ( 현재 페이지 * 페이지수 )가 더 많다면 다음 페이지가 존재한다


- **이전 페이지 존재 여부** : 1보다 현재 페이지가 크다면 이전페이지가 존재한다


- **다음 페이지숫자** : 현재 페이지 + 1


- **이전 페이지숫자** : 현재 페이지 - 1


- **마지막 페이지** : ( 총 제품의 갯수 / 보여줄 제품 갯수 ) 를 올림처리하면 총 페이지 갯수 및 마지막 페이지 수를 알 수 있다

````javascript
/** ===== controller/shop.js ===== */
/** 몇개의 제품을 가져올 것인지 설정하는 상수 */
const ITEMS_PER_PAGE = 2;

/**
 * - index Controller
 * @param req
 * @param res
 * @param next
 */
exports.getIndex = ( req , res , next ) => {
    /** page 쿼리에 접근 */
    const page = Number( req.query.page ) || 1;

    let totalItems = 0;

    Product.find()
        /** 찾은 Product 의 총계를 반환함 */
        .countDocuments()
        .then( numProducts => {
            totalItems = numProducts;
            console.log( '<< numProducts >>' , numProducts );
            return Product.find()
                /**
                 * - skip 메서드를 추가하면,
                 *   find 로 찾은 결과중 첫 번째부터 skip 갯수만큼 생략한다
                 */
                .skip( ( page - 1 ) * ITEMS_PER_PAGE )
                /**
                 * - limit 메서드는 find 로 가져오는 데이터양을 지정할 수 있다
                 */
                .limit( ITEMS_PER_PAGE )
        } )
        .then( products => {
            res.render( 'shop/index' , {
                pageTitle : 'Shop' ,
                path : '/' ,
                prods : products ,
                currentPage : page,
                /**
                 * - ( 현재 페이지 * 현재 페이지 갯수 ) 보다
                 *   총 아이템갯수가 클 경우에만 다음 버튼이 나온다
                 * */
                hasNextPage : ITEMS_PER_PAGE * page < totalItems,
                /** 1 페이지가 아닐 경우에만 이전 버튼이 나온다 */
                hasPreviousPage : page > 1,
                nextPage : page + 1,
                previousPage : page - 1,
                /** 전체 페이지를 보여줄 페이지 갯수만큼 나누고 올려서 반환하면, 총 페이지 갯수를 알 수 있다 */
                lastPage : Math.ceil( totalItems / ITEMS_PER_PAGE ),
            } );
        } )
}
````

- 실제 view 영역에서는 아래처럼 조건에 따라, view visible 처리를 진행하면 된다


- anchor 태그의 href 값에 / 없이 쿼리값만 입력하면 **현재경로에 쿼리값이 매핑**된다

````ejs
<!-- ===== views/includes/pagination.ejs ===== -->
<section class="pagination">
    <!-- 현재 페이지가 첫 페이지가 아니고, 이전 페이지가 1 이 아닐 경우 -->
    <% if ( 1 !== currentPage && 1 !== previousPage ) { %>
        <a href="?page=1">1</a>
    <% } %>
    <!-- 이전 페이지가 있을 경우 -->
    <%  if ( hasPreviousPage ) { %>
        <a href="?page=<%= previousPage %>"><%= previousPage %></a>
    <% } %>
    <a href="?page=<%= currentPage %>" class="active"><%= currentPage %></a>
    <!-- 다음 페이지가 있을 경우 -->
    <%  if ( hasNextPage ) { %>
        <a href="?page=<%= nextPage %>"><%= nextPage %></a>
    <% } %>
    <!-- 현재 페이지가 마지막이 아니고, 다음 페이지가 마지막이 아닐 경우에만 렌더링한다 -->
    <%  if ( lastPage !== currentPage && nextPage !== lastPage ) { %>
        <a href="?page=<%= lastPage %>"><%= lastPage %></a>
    <% } %>
</section>
````

- Mongoose 의 find 메서드는 모든 제품을 가져올수도있지만, 원하는 종류의 데이터를 선택해서 가져올 수도 있다.

---

### Asynchronous JS Requests

- Client <-> Server


- 보통 클라이언트가 요청을 보내고 서버가 응답을 반환한다


- 비동기식 요청은 JSON 데이터 형식을 이용하여 통신한다

---

### Delete Product

- 만약, 삭제페이지에서 제품 삭제 요청을 보내게 되면, 다시 페이지를 리다이렉트시키는게 아니라,


- 삭제 요청에대한 응답을 받고 브라우저에서 해당 목록을 다시 렌더링하는 식으로 사용한다


- < form > 태그로 보내는 요청은, **xwww URL 암호화 데이터로 보내는 요청**이다


- 비동기 통신을 위해 < form > 태그를 제거하고, 직접 스크립트로 설정한다

````ejs
<!-- ===== views/admin/products.ejs ===== -->
<div class="card__actions">
  <a href="/admin/edit-product/<%= product._id %>?edit=true" class="btn">Edit</a>
  <input type="hidden" value="<%= product._id %>" name="productId">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>
    <button class="btn" type="button" onclick="deleteProduct( this )">Delete</button>
</div>
````


- 요청을 처리하는 핸들러 에서 HTTP 메서드중 delete 메서드등을 이용하여 명확히 제거할 수 있다

````javascript
/** ===== routes/admin.js ===== */
const router = express.Router();

router.delete( '/product/:productId' , isAuth , adminController.deleteProduct );

````

- HTTP delete 메서드는 요청 body 를 가지지 않기 때문에 더이상 body 에서 추출하지 않는다
  - express 서버에 설정한 CSRF 패키지( csurf )는 body 뿐만아니라, 
  - header 에서도 csrf 토큰을 찾기 때문에 http-body 없이 http-header 에 토큰을 부착해도 된다
  - 따라서, delete 메서드를 사용할 수 있다


````javascript
/** ===== controllers/admin.js ===== */
/**
 * - 제품 제거 Controller
 * @param req
 * @param res
 * @param next
 */
exports.deleteProduct = ( req , res , next ) => {
    // const prodId = req.body.productId;
    const prodId = req.params.productId;
}

````

- 또한 더이상 리다이렉트시키지 않고 JSON 응답을 내려줄 수 있다

````javascript
/** ===== controllers/admin.js ===== */
/**
 * - 제품 제거 Controller
 * @param req
 * @param res
 * @param next
 */
exports.deleteProduct = ( req , res , next ) => {
    const prodId = req.params.productId;
    Product.findById( prodId )
        .then( product => {
            res.status( 200 ).json( { message : 'Success!' } );
        } )
        .catch( err => {
            res.status( 500 ).json( { message : 'Deleting product failed.' } );
        } );
}
````

- 프론트에서 csrf 를 부착할때, CSURF 패키지에서 지원하는 이름( csrf-token 등.. )으로 부착하면 서버에서 해당 토큰을 읽어들인다


- csrf 요청을 보내고 아래처럼 직접 DOM 제거등 응답값을 처리하여 비동기로 처리할 수 있다

````javascript
/** ===== public/js/admin.js ===== */
/**
 * - 제품 제거 이벤트
 */
const deleteProduct = ( btn ) => {
  const prodId = btn.parentElement.querySelector('[name=productId]').value;
  const csrf = btn.parentElement.querySelector('[name=_csrf]').value;

  const productElement = btn.closest( 'article' );

  fetch( `/admin/product/${ prodId }` , {
    method : 'DELETE',
    headers : {
      'csrf-token' : csrf
    }
  } )
    .then( result => {
      return result.json();
    } )
    .then( data => {
      console.log( '<< data >>' , data );
      productElement.parentElement.removeChild( productElement );
    } )
    .catch( err => {
      console.log( '<< err >>' , err );
    } )
};
````

---

- fetch API 더알아보기: https://developers.google.com/web/updates/2015/03/introduction-to-fetch


- AJAX Requests 더 알아보기: https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started

---

### Adding Payments

- Stripe 를 이용한 가상 결제 시스템 만들기


- Payment Process
  - 결제 방식에 대한 정보( 신용카드 ) 수집
  - 신용카드 정보가 정확한지 체크
  - 신용카드에 비용 청구
  - 결제 내역 관리
  - 내 서버( 앱 )에서 주문 처리

  
- 결제관련해서는 법 and 기술적으로 복잡하여, 아웃소싱업체에서 담당한다
  - 보통 Stripe 서비스를 사용한다


- 클라이언트와 서버 데이터만 작성하면된다
  - 클라이언트에서 신용카드 데이터를 수집하여 Stripe 서버로 보낸다
  - Stripe 서버에서 값이 유효한지 체크후 신용카드 데이터를 암호화한 토큰과 확인 내역을 보내준다
  - 그럼 우리 서버에 토큰을 보내, 서버에서 신용카드에 청구하거나, Stripe 를 통해 결제방식에 청구한다
    - ( 요금객체를 생성해서, 토큰과 가격 정보를 Stripe 에 보내면 Stripe 가 청구와 관리를 담당한다 )


---

### Payments

- 현재 Stripe 는 한국을 지원하지 않아서, nicePay( 신용카드 종합결제 ) 와 kakaoPay 로 대체하기로 한다


- nicePay 같은 경우에는 클라이언트에서 나이스 API 를 호출하기 때문에, 클라이언트에 url 및 정보등을 넘겨야한다

````javascript
/** ===== controller/shop.js ===== */
const privateKeys = require( '../util/privateKeys' );
/**
 * - checkout controller
 *
 * @param req
 * @param res
 * @param next
 */
exports.getCheckout = ( req , res , next ) => {

  /** 결제 정보 렌더아이템 */
  const paymentInfo = {
    niceClientId : privateKeys.NICE_PAY_CLIENT_KEY,
    lineItems : products.map( p => ( {
      name : p.productId.title,
      description : p.productId.description,
      amount : p.productId.price,
      currency : 'won',
      quantity : p.quantity,
    } ) ),
    successURL : `${ req.protocol }://${ req.get( 'host' ) }/checkout/success`,
    niceReturnURL : `${ req.protocol }://${ req.get( 'host' ) }/payment/nice-pay/success`,
    cancelURL : `${ req.protocol }://${ req.get( 'host' ) }/checkout/cancel`,
  };

  res.render( 'shop/checkout' , {
    pageTitle : 'Checkout',
    path : '/checkout',
    products : products,
    totalSum : total,
    paymentInfoStr : `${JSON.stringify( paymentInfo )}`,
  } );
}
````

- 서버에서 클라이언트에 넘겨준 데이터는 inline 으로 삽입된 script 태크에서 접근할 수 있는데, 


- 일반 데이터는 해석을 잘 못하고 JSON 화 시킨 후, 해석해서 해당 script 태그에서 데이터를 저장한다

````html
<script>
  /** 전역변수에 필요한 데이터 저장 */
  const paymentInfo = '<%= paymentInfoStr %>'.replace(/\&#34;/gi, '"' ).replace( /\s*/g, "" );
  window.paymentStore = JSON.parse( paymentInfo );
  window.paymentStore.csrfToken = '<%= csrfToken %>'
  window.paymentStore.amount = paymentStore.lineItems.reduce( ( acc , item) => {
    acc += item.amount;
    return acc;
  } , 0 );
  window.paymentStore.name = paymentStore.lineItems[ 0 ].name || "";
</script>
````

- 그 후, 결제 스크립트 내부에서 저장된 값들에 접근할 수 있도록 한다


- 카카오페이와 나이스페이결제를 호출하는 api 들에서 해당 값들을 불러와 사용하며, 


- 각각 페이별 결제 로직을 탄다

````javascript
/** ===== public/js/payment.js ===== */
/**
 * - 카카오페이 결제
 */
kakaoPayBtn.addEventListener( 'click' , ( e ) => {
    const reqParam = Object.keys( paymentStore ).reduce( ( ( acc , key ) => {
        if ( 'lineItems' !== key ){
            acc[ key ] = paymentStore[ key ];
        };
        return acc;
    } ) , {} );

    const params = new URLSearchParams( reqParam ).toString();

    console.log( 'params' , params );
    fetch( `/payment/kakao-pay?${ params }` , {
        method : 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'csrf-token' : paymentStore.csrfToken,
        },
    } )
        .then( res => {
            return res.json()
        } )
        .then( data => {
            console.log( '<< data >>' , data );
            window.open(data.redirectUrl,'_blank');
        } )
        .catch( err => {
            console.log( '<< err >>' , err );
        } );
} );

/**
 * - 나이스페이 결제
 */
creditCardBtn.addEventListener( 'click' , ( e ) => {
    AUTHNICE.requestPay( {
        clientId : paymentStore.niceClientId,
        method : 'card',
        orderId: Math.random().toString(16).substr(2, 8),
        amount : paymentStore.amount,
        goodsName: paymentStore.name,
        returnUrl: paymentStore.niceReturnURL, //API를 호출할 Endpoint 입력
        fnError: function (result) {
            alert('개발자확인용 : ' + result.errorMsg + '')
        }
    } );
} );

````

- 카카오페이는 내 서버에서 리다이렉트 시키므로 CSRF 문제가 없었지만,


- 나이스페이결제의 경우 외부 서버에서 리다이렉트시키므로 CSRF 이슈가 있으므로, 해당 경로의 CSRF 를 예외처리해두는 방식으로 처리하였다

````javascript
/** ===== app.js ===== */
const csrf = require( 'csurf' );

/** 세션에 CSRF 토큰 값을 설정하는 미들웨어 생성 */
const csrfProtection = csrf();

/** CSRF 가 session 을 이용하기 때문에 session 다음에 미들웨어 등록 */
app.use( ( req , res , next ) => {
    /** 나이스 결제시 예외등록 */
    if ( '/payment/nice-pay/success' === req.url ){
        req.csrfToken = () => {
            return '12345';
        }
        return next();
    }
    csrfProtection( req , res , next );
} );
````

- 그 외에는 라우터와 컨트롤러에서, 각 페이들에서 제공하는 가이드라인대로 진행하면 문제없이 동작한다


- 결과적으로 주문을 하게되면, cart 에 있는 제품들을 제3자 패키지( 카카오페이, 나이스페이 )등에 주문 결제처리를하고,


- orders 에 추가하게 되는데, 현재 버그는 /checkout/success 을 그냥치고 들어가도 자동으로 장바구니가 지워지고 주문했다고 표시되는 버그가 존재한다


- 해당 버그는 데이터베이스와 카카오페이 , 나이스페이의 주문 내역을 비교하여 체크할 수 있다


- 실제 운영환경에서는 **WebHooks( 카카오페이 , 나이스페이등 각각에서 제공한다 )** 을 이용하는것이 좋다

---

