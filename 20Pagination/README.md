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

