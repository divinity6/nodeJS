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



