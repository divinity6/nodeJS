## Storing Data in Database

- 파일에 데이터를 저장하게 되면, 저장하는 데이터 수가 많아질수록,


- 파일 접근이 특히 느려지기 때문에 실제 상황에서는 사용하지 않는다


- 그대신, 데이터 저장과 검색에 특화된 데이터베이스를 사용한다


- 이번장에서는 SQL 과 NoSQL 에 대해 알아본다

---

- 목표는 항상 데이터를 저장하고, 쉽게 사용 or 접근 하기 위함


- 코드 뿐 아니라, 데이터 접근도 용이하게 하는 것이다
  - 즉, 내부데이터가 커지더라도 파일에 접근할때보다 빠르다


- SQL 종류 예시 : MySQL


- NoSQL 종류 예시 : MongoDB

---

### What's SQL

- SQL 데이터베이스는 테이블 요소를 통해 사고한다


- 테이블 예시)

- **Users 테이블**

| **id** |   **email**   |        **name**         |
|:------:|:-------------:|:-----------------------:|
|   1    | max@test.com  | Maximilian Schwarzuller |
|   2    | manu@test.com |      Manuel Lorenz      |
|  ...   |      ...      |           ...           |

- **Products 테이블**

| **id** | **title** | **price** | **description** |
|:------:|:---------:|:---------:|:---------------:|
|   1    |   Chair   |  120.99   |  A comfy chair  |
|   2    |   Book    |   10.99   | Exciting book!  |
|   3    |    ...    |    ...    |       ...       |


- **Orders 테이블**
  - SQL 기반 데이터베이스는 중요한 특성이 있다
  - 다른 테이블들을 연결할 수 있게 해준다
    - 예) 주문 : 사용자 id , 제품 id

| **id** | **user_id** | **product_id** |
|:------:|:-----------:|:--------------:|
|   1    |      2      |       1        |
|   2    |      1      |       1        |
|   3    |      2      |       2        |


- 위의 예시가 SQL 의 강력한 특징 중 하나이다

---

### Core SQL Database Characteristics

- SQL 데이터베이스의 핵심 특성은 DataSchema( 데이터 스키마 )를 가지고 있어,


- 각각의 표마다 내부 데이터의 형태, 보유한 영역과 각각 저장되는 데이터의 종류를 분명하게 정의하게 된다
  - ( Number , String , Text , Boolean ... )


- 데이터 종류를 정의한 스키마를 테이블의 모든 데이터들은 준수해야 한다

---

### SQL 데이터베이스의 핵심 개념


1. **스키마, 데이터 형태에 대한 정의**한다


2. **일대일, 일대다 또는 다대다등 데이터간 관계가 존재한다.**
   - 즉, 다양한 테이블간의 관계를 정의한다
   - 테이블들이 연결되어 있다는 뜻이다


- Queries 는 데이터베이스와 상호작용을 할 때 사용하는 명령들이다

````sql
SELECT * FROM users WHERE age > 28
````

- **( SELECT , FROM , WHERE )** 등이 쿼리 키워드이다


- **( * , users , age > 28 )** 등이 파라미터, 데이터이다

---

### NoSQL

- SQL 방식을 따르지 않는다는 것이다


|  **Database**   |      Shop      |
|:---------------:|:--------------:|
| **Collections** | Users , Orders |

> **Users**
> 
> ````json
> {
>  "name" : "Max",
>  "age" : 29
> }
> ````
>
> ````json
> {
>  "name" : "Manu"
> }
> ````

> **Orders**
>
> ````json
> { ... }
> ````
>
> ````json
> { ... }
> ````

- NoSQL 에서 테이블은 집합이라고 부르는데 테이블이라고 생각해도 된다
  - ( Table 과 같은 개념이지만 집합이라고 부른다 )


- NoSQL 에는 엄격한 스키마가 존재하지 않는다
  - 즉, 같은 그룹에 각각 다른 구조를 지닌 다수의 문서들을 저장할 수 있다

---

### What's NoSQL

- NoSQL 에서는 데이터들의 상관관계가 존재하지 않는다


- 대신 데이터를 복제하게 된다


- 집합 예시)

- **Order 테이블**

| { id : 'ddjfa31' , user : { id : 1 , email : 'max@test.com' } , product : { id : 2 , price : 10.99 } }  |
|:-------------------------------------------------------------------------------------------------------:|
| { id : 'lddao1' , user : { id : 2 , email : 'manu@test.com' } , product : { id : 1 , price : 120.99 } } |
|                        { id : 'nbax12' , product : { id : 2 , price : 10.99 } }                         |
|                                                 { ... }                                                 |


- **Users 테이블**

| { id : 1 , name : 'Max' , email : 'max@test.com' }  |
|:---------------------------------------------------:|
| { id : 2 , name : 'Manu', email : 'manu@test.com' } |
|                       { ... }                       |


- **Products 테이블**

| { id : 1 , title : 'Chair' , price : 120.99 } |
|:---------------------------------------------:|
|   { id : 2 , name : 'Book', price : 10.99 }   |
|                    { ... }                    |


- 즉, SQL 과 다르게 , Orders 테이블에 Users , Products 테이블의 데이터들을 복제하는 것이다
  - ( 물론, 데이터가 변경된다면, 여러집합에서 이 데이터들을 업데이트해야한다 )


- 데이터를 요청받았을때, Orders 집합에서 불러오기만 하면 되기때문에 속도가 매우 빠르다


- 일반적으로 NoSQL 의 특징은 강한 데이터 스키마가 없으며, 동일한 집합에 혼합된 데이터가 존재할 수 있고,


- 어떤 구조도 강요되지 않으며, 데이터 상관관계도 없다

---

 ### Horizontal , Vertical Scaling

- 데이터베이스를 확장하는 방법으로는 2가지가 존재한다


- **수평 스케일링( Horizontal Scaling )**
  - 서버를 더 추가하는 것
  - 이를 무한으로 진행할 수 있다는 장점이 있다


- **수직 스케일링( Vertical Scaling )**
    - 존재하는 서버에 CPU , 메모리 추가등 더 강력하게 만드는 것
    - 이는 한계가 존재한다

---

### SQL vs NoSQL

|                    SQL                    |
|:-----------------------------------------:|
|                데이터 스키마 사용                 |
|               데이터 들이 관계를 맺음               |
|        데이터 들이 많은 테이블에 분산된 뒤 관계를 맺음        |
| 스케일링에 있어 SQL 이 작동하는 방식으로 인해, 수평 스케일링이 어렵다 |

- 데이터들이 관계를 맺어야할 경우 좋은 선택이다


- 자주 변경되지 않는 사용자 데이터일 경우 SQL 이 좋은 선택이다


|                   NoSQL                    |
|:------------------------------------------:|
|                 데이터 스키마 없음                 |
|               데이터 관계가 없거나 적음               |
| 존재하는 Docs 내에서 병합하거나, 중첩된 collection 으로 작업함 |
|          NoSQL 의 경우 수평 스케일링이 더 쉽다          |

- 주문, 장바구니처럼 자주 변경되는 부분들은 NoSQL 을 사용할 수 있다


- 상관관계가 중요하지 않는 이유는 주문정보를 단일문서에 배치할 수 있기 때문이다

---

### NodeJS MySQL

- NodeJS 에서 mysql 코드 작성 및 실행가능하게 해준다

````shell
npm install --save mysql2
````

- 쿼리를 실행할때마다, 연결했다 끊었다하는것이 아닌,


- connectionPool 을 통해 실행할 쿼리가 있을때마다 활용하는것이 효율적이다

````javascript
/** 아래 형식으로 mysql 을 가져올 수 있다 */
const mysql = require( 'mysql2' );

const pool = mysql.createPool( {
  host : 'localhost',
  user : 'root',
  database : 'node_complete',
  password : 'Tpsl782505@'
} );

module.exports = pool.promise();

````

- 가져올때, 첫번째 배열은 해당 테이블의 데이터이며, 


- 두번째 배열은 해당 테이블의 메타 정보를 담고 있다

````javascript

const db = require( './util/database' );

/**
 * - db sql 문법 이용가능
 *
 * --> pool 을 promise 객체로 내보냈다는걸 기억해라
 * 
 * // result : [ 테이블데이터[] , 테이블메타정보[] ]
 */
db.execute( 'SELECT * FROM products;' )
        .then( ( result ) => {
          console.log( '<<database connection result>>' , result );
        } )
        .catch( err => {
          console.log( '<<database connection err>>' , err );
        } );

````

- 데이터를 삽입할때는 insert 쿼리를 사용한다

````sql
INSERT INTO prodoucts ( title , price , imageUrl , description ) VALUES ( 데이터들... );
````

- 그러나 NodeJS 로 삽입할 경우, SQL 인젝션 공격을 방지하기위해, mysql 모듈에서 제공해주는 파라미터를 이용한

````javascript
const db = require( '../util/database' );

db.execute( 'INSERT INTO products ( title , price , imageUrl , description ) VALUES (?, ?, ?, ?)',
[ this.title , this.price , this.imageUrl , this.description ] );
````