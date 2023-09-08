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
    const page = req.query.page;

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
