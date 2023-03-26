## BasicConcept

---

### How the Web Works 

- 웹은 어떻게 동작하는가?


>> User/Client( Browser )( enter )
>
>> --> http://my-page.com
>
>> --> Domain Lookup
>> ( Request )
> 
>> Server( at 10.212.212.12 )
>
>> < MyCode >
> 
>> Database
> 
>> Response( e.g. HTML page )

---

### CoreModules

- NodeJS 에는 내장된 CoreModules 이 존재한다


- **http** : 서버생성 및 http 요청 응답
  - Launch a server, send requests
  - 다른 서버로 요청을 보내 여러 서버간에 소통할 수 있다


- **https** : 모든 전송 데이터 암호화 SSL 서버
  - Launch a SSL server


- **fs** : 파일시스템


- **path** : 경로 구축


- **os** : 운영체제 관련

---

### Keyword

- **require** : NodeJS 에서 해당 키워드는 다른 파일의 경로나 JS 파일을 import 할 수 있다
  - 파일을 불러올시 절대경로는 ( **/** )
  - 상대경로는 ( **./** )
  - 경로를 생략하면 글로벌 모듈에서 찾게된다

---

### Note

- **http.createServer** 만 작성한채로 app.js 를 실행하게 되면 아무일도 일어나지 않는 이유
  - 서버에 request 를 보내지 않았기 때문에
  - 해당 요청 콜백이 작동하지 않음


- **Server.listen** 메서드는 
  - NodeJS 가 스크립트를 바로 종료시키지 않고,
  - 계속해서 들어오는 요청을 듣도록 한다


- 이상태에서 app.js 를 실행하면 프로세스가 계속 동작중인것을 확인할 수 있다
  - looping 프로세스를 통해 요청을 계속해서 listen 하고 있기 때문이다
  - 즉, 계속해서 웹 서버가 요청을 듣고 있는 것이다


- 이상태에서 브라우저에 localhost : 3000 을 입력하면 
  - 현재 서버가 아무 html 도 반환하지 않기 때문에
  - 해당 페이지에서는 아무것도 나오지 않는다


- 이것이 NodeJS 에서 서버를 생성하는 방식이다

---

### Node.js Program Lifecycle

- nodeJS 프로그람을 실행하면 아래와 같이 동작한다


- node app.js 
  - -> StartScript 
  - -> Parse Code, Register Variables & Functions
  - -> **Event Loop**
    - ( Keeps on running as long as there are event listeners registered )
  - -> process.exit()


- NodeJS 에서 중요한 개념이 **Event Loop** 다
  - NodeJS 에서 관리하는 EventLoop 는 
  - 작업이 남아있는한 계속해서 작동하는 loop 프로세스인데
  - 해당 EventLoop 는 EventListener 가 존재하는한 **계속 작동한다**
  - ( 서버가 계속 작동하기 위해서는 제거하면 안된다 )


- Core Node 애플리케이션은 이 Event Loop 에 의해 관리된다
  - ( 사실상 모든 코드를 관리한다 )


- EventListener 가 있거나, createServer 메서드가 listener 를 새엇ㅇ하는한


- Node.js 의 Event Loop 는 계속된다


- 언젠가 제거해야한다면 process.exit() 를 사용하면 된다
  - 해당 함수가 실행되면 프로세스가 종료된다
  - 보통은 서버를 종료할일이 없기 때문에 process.exit 를 호출할일이 없다



---

### EDA( 이벤트 드리븐 )


- NodeJS 는 서버관리를 포함해 다양한 방면에서 **이벤트 드리븐( EDA )** 접근 방법이다


- NodeJS 가 이벤트 드리븐( EDA ) 방식을 사용하는 이유는 **SingleThread( 단일 스레드 )** 방식이기 때문이다


- 즉, 실행중인 컴퓨터에서 전체 Node 프로세스가 **하나의 스레드를 사용**한다는 뜻이다
  - ( 사실, 내부에서는 운영체제의 영향력에 따라 약간의 다중 스레드를 사용한다 )