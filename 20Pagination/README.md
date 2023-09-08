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
