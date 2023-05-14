## MVC( Models View Controllers )

- 서버를 작성할때 코드를 구조화하는 특정 패턴을 따라야한다

---

### What's MVC?

- 관심사를 분리하는 역할을 한다


- 코드의 어떤 부분이 어떡 작업을 책임지고 있는지 아는 것


- Models : 데이터를 나타내는 부분
  - 데이터 관련 작업을 할 수 있게 한다


- View : 사용자 화면
  - html 에 렌더링 후 사용자에게 보내는 역할


- Controllers
  - Model 과 View 와 연결점
  - 중간 논리를 책임진다
  - 예시) Router


---

### routes

- 현재 routes 폴더안에서 데이터등에 접근( products )하고, View 에 반환( res.render )하고 있다 
  - 그러나 이는 전형적인 controller 의 역할이다


- controller 를 나누게되면 해당하는 router 와 해당 controller 가 무엇인지 쉽게 알 수 있다

---

### Models

- MVC 패턴의 model( 데이터 ) 부분


- 데이터베이스와 연결논리등이 추가될 경우 Model 분리효과가 나타난다


- 데이터에 관련된 역할을 담당한다

---

### Views

- MVC 패턴의 view( 화면 ) 부분


- 사용자가 보는화면에 논리가 많이 들어가면 안된다


---
### Controllers

- MVC 패턴의 controller( 중재자 ) 부분


- Model 과 View 의 연결부분역할을 수행한다

---


### fileSystem

- 데이터베이스가 아닌, 파일에 json 형태로 저장해 둘 수 있다



- 아래 코드를 통해 해당 파일의 패스를 읽어올 수 있다

````javascript

const path = require( 'path' );

/**
 * 
 * @param { string } path - 파일 경로
 * @param { string } folder - 폴더이름
 * @param { string } file - 파일이름
 */
const _path = path.join(
    path.dirname( process.mainModule.filename ) ,
    'data' ,
    'products.json'
);


````

- 아래 코드를 통해 파일을 버퍼별로 읽어올 수 있다

````javascript

const fs = require( 'fs' );

/**
 * @param { string } path - 파일 위치 패스
 * @param { callback : ( err , fileContent ) => any } callback - 파일을 읽은 후 실행할 콜백
 */
fs.readFile( _path ,( err, fileContent ) => {
    console.log( err );
    console.log( fileContent );
} );

````

- 아래 코드를 통해 파일을 저장할 수 있다

````javascript

const fs = require( 'fs' );

/**
 * @param { string } path - 파일 위치 패스
 * @param { any } data - 저장할 데이터
 * @param { callback : ( err ) => any } callback - 파일을 읽은 후 실행할 콜백
 */
fs.writeFile( path , JSON.stringify( products ) , ( err ) => {
  console.log( err );
} );


````
---

- MVC 에 대해 더 알아보기: 
  - https://developer.mozilla.org/en-US/docs/Glossary/MVC
