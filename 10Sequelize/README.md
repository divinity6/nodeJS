## Sequelize

- MySQL 데이터베이스를 사용하지만, 사용하는 코드가 다르다

````javascript
/**
 * - 이런 SQL 문 대신, 외부 패키지를 통해 JS 객체로 데이터베이스에 간편하게 CRUD 를 할 수 있다
 */
db.execute( 'INSERT INTO products ( title , price , imageUrl , description ) VALUES (?, ?, ?, ?)',
    [ this.title , this.price , this.imageUrl , this.description ] );

````

### What is Sequelize?

- Sequelize 는 제 3자 외부 패키지로 Object-Relational Mapping 라이브러리이다
  - ( 백그라운드에서 실제로 SQL 코드를 처리하며, JS 객체로 매핑해 SQL 코드를 실행하는 편리한 메서드를 제공한다 )


- 객체가 Sequelize 에 의해 데이터베이스에 매핑되면, 테이블을 자동으로 생성한다
  - ( 테이블 뿐만아니라, 관계까지 자동으로 설정까지해준다 )


- 즉, Sequelize 내부에서 쿼리를 실행해 데이터베이스에 접근한다


- Sequelize 는 데이터베이스를 다루는 Model 을 제공하며, 모델을 정의할 수 있게한다.