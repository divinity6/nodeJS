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