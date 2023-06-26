## NoSQL Databases / MongoDB

- NoSQL 기반 데이터베이스인 MongoDB 또한 SQL 데이터베이스만큼 많이 사용한다


---

### What is MongoDB?

- MongoDB 는 회사이름이기도 하지만, 그 회사의 메이저 제품인 데이터베이스 솔루션, 엔진 이름이다


- 효율적인 NoSQL 데이터베이스를 실행할 수 있는 툴이다
  - ( 규모가 큰 어플리케이션을 위해 구축된 DB 다 )


- 데이터 쿼리, 저장 ,상호작용등 아주 빠르게 처리할 수 있으며, 
  - NoSQL 데이터베이스와 MongoDB 가 기반한 훌륭한 데이터베이스다

---

### How it works

- SQL 의 경우, 데이터베이스에 테이블이 여러개 있지만, 


- NoSQL MongoDB 의 경우, Collection 이 여러개 있다


- 또한, 각 Collection 에는 기록이 아닌, Document 가 존재한다
  - ( 명칭만 다른게 아니라, 이 데이터베이스의 핵심 철학에 큰 차이점이 있다 )


- MongoDB 는 Schemaless 로 
  - Collection 의 Document( 데이터 or 항목 )가 같은 구조를 가질 필요가 없다
  - 즉, 한 Collection 안에 어떤 유형의 데이터가 있어도 상관 없다


|    **Database**    |                                            Shop                                            |
|:------------------:|:------------------------------------------------------------------------------------------:|
|  **Collections**   |                                       Users, Orders                                        |
|   **Documents**    | Users : [ { name : 'Max' , age : 29 } , { name : 'Manu' } ] , Orders [ { ... } , { ... } ] |


#### JSON ( BSON ) Data Format

- MongoDB 의 데이터 표기는 JSON 표기법이다
  - JSON 표기법을 이용해 데이터를 저장한다
  - 엄밀히 말하면 Binary JSON 인 Binary JSON 이다

  
- 따라서, 데이터 유연성이 매우 크다고 볼 수 있다


````json
{
  "name" : "Max",
  "age" : 29,
  "address" : {
    "city" : "Munich"
  },
  "hobbies" : [
    {"name" :  "Cooking"},
    {"name" :  "Sports"}
  ]
}
````

---

### What's NoSQL

- NoSQL 에서는 아래와 같이 중복되는 데이터 구조가 있는 형태가 자주 나타난다


- 해당 데이터의 일부가 다른 문서에 내장 or 중첩되어 있을 가능성이 높다


- 따라서, SQL 처럼 root 의 id 를 이용해 패칭하는 것이 아니라, 다른 문서를 가르키는 ID 를 내장하여, 두 문서를 병합하는 방식을 사용한다


- 그러나, 중점이 되는 정보만 가지고, 다른 문서에서 함꼐 가져올 수 있다
  - 예) 
    - orders 테이블이 user 테이블 정보를 embed 하고 있으면, 
    - orders 테이블을 검색할때마다, user 테이블을 검색할 필요가 없다
    - **이측면에서 MongoDB 가 훨씬 빠르고 효율적인 것이다**


- 즉, 서버의 백그라운드에서 여러 컬렉션을 합치지 않고도, 필요한 형식의 데이터를 가져올 수 있다


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

---

### Relations - Options

#### Nested / Embedded Documents

- **Customers 테이블**

````json
{
  "userName" : "Max",
  "age" : 29,
  "address" : {
    "street" : "Second Street",
    "city" : "New York"
  }
}
````

- Customers 테이블에 address 객체가 있어서, 
  - 굳이 따로 id로 검색할 필요가 없는 장점이 있다

#### References

- 중복되는 데이터가 아주 많으며, 데이터를 많이 다뤄야해서 자주 변경될 경우, Nested 보단 Reference 가 좋은 방법이다


- 좋아하는 책이 자주 변경되는 **Customers 테이블**


- 자주 변경되어야 해서 좋지 않은 테이블

````json
{
  "userName" : "Max",
  "favBooks" : [ { ... } , { ... } ]
}
````

- 아래처럼, 분리하여 저장

````json
{
  "userName" : "Max",
  "favBooks" : [ "id1" , "id2" ]
}
````

````json
{
  "id" : "id1",
  "name" : "Lord of the Rings 1"
}
````

- 즉, 목적에 따라 Nested / Reference 를 사용하면 된다

---

- 결론적으로 **Schema 가 없어서, 특정 구조가 필요하지 않아 유연성이 향상**된다