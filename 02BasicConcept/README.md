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

---

### Request 

- url : 요청 객체의 url 은 도메인 주소 다음 url 이다


- method : http 메서드( url 접속시 GET )


- headers : http header

---

### Response

- setHeader : 응답유형 메시지 정보( Content-Type 등 )


- write : 응답 데이터 작성


- end : 응답 데이터 작성 마무리


- writeHead : 메타정보를 한꺼번에 입력할 수 있게 해준다


- writeFileSync : 파일시스템

---

### Streams & Buffers

> Example : Incoming Request

- **Stream** : 지속적인 프로세스
  - Node 가 많은양의 요청을 한 Chunk 씩 읽고, 어느순간 다 읽게된다


- **Fully Parsed** : 요청 전체를 읽기까지 기다리지 않고, 각각의 Chunk 를 다룰 수 있다


- input Data 는 금방 처리하지만( 적은 요청 ) file 의 경우에는 상당히 오래걸린다( 많은 요청 )


- 파일이 들어오는 동 데이터를 스트리밍한다
  - 즉, 데이터가 들어오는 와중에 Node 앱이 실행중인 server 에 쓸 수 있기 때문에 
  - 파일 전체가 분석완료되고, 전부 업로드 되기까지, 아무것도 안하면서 기다릴 필요가 없다
  - Node.js 는 들어오는 요청이 얼마나 크고 복잡한지 미리 알지 못하기 때문이다


- Buffer( queue ) 를 이용해 들어오는 데이터를 미리 다룰 수 있다


- Buffer 는 버스 정류장과 비슷하다
  - 여러개의 Chunk 를 보유하고, 파싱이 끝나기 전에 작업할 수 있도록 한다
  - 이것을 Buffer 가 가능하게 한다
  - 즉, Chunk 를 작업하려면 Buffer 를 사용하면 된다


````javascript

/** 
  * - 사용자지정 event listener
  * 
  *  'data' - 새 청크가 읽힐 준비가 될때마다 콜백이 실행된다
  */
req.on( 'data' , ( chunk ) => {} );
/**
 * - 사용자지정 event listener
 *
 *  'end' - 데이터가 모두 들어오고 분석이 완료된 후 콜백 실행
 */
req.on( 'end' , () => {} );

````

### 비동기 코드

- fileSystem 객체의
  - writeFileSync 메서드는 다음구문을 분석하지 않고,
  - file 을 다쓸때까지 기다리는 메서드다
  - 반대로 writeFile 메서드는 콜백으로 
  - file 동작이 완료된 후 실행할 이벤트를 등룍할 수 있다

---

### Single Thread, Event Loop & Blocking Code

> Incoming Requests
>
> ---
> 
> < Your Code > | **Single JavaScript Thread** 
> 
>> --> ( start ) --> Event Loop
>>
>> **Handle Event Callbacks**
> 
>> --> fs ( Send to ) --> Worker Pool --> Different Thread(s)!
>>
>> --> Event Loop
>>
>> **Do the Heavy Lifting**
>  

- Node.js 코드에서 꼭 기억해야하는 것은 Node.js 는 


- Single Thread Javascript 만 사용한다는 것이다
  - Thread : 
    - 운영체제 프로세스로 하나의 스레드만 사용한다면
    - 어떻게 여러개의 요청을 처리할 수 있을까?
    - 각 요청마다 Thread 를 지정할 수 없기 때문에,
    - 결국 모두 하나의 Thread 에서 실행되고
    - 보안상의 문제가 제기될 것이다
      - ( A 요청 데이터와 B 요청의 데이터가 서로 접근하는등... )
    - 성능에서 제일 중요한 점으로
    - 요청 A 를 처리중이라면, 요청 B 는 처리할 수 없는 것인가?
    - Node.js 는 둘 다 처리할 수 있다


- fileSystem( fs ) 에 접근할 수 있는 코드가 있다고 할 때,


- 보통 파일을 다루는 작업은 시간이 오래걸린다
  - 파일의 크기가 클수도있고, 꼭 바로 완료되는 것은 아니다


- 따라서 만약 첫번째 요청에서 파일을 처리하고 있을때,


- 두 번째 요청은 처리할 수 없기 때문에 기다려야하거나, 거부되기도 한다
  - ( 해당 사용자에 의해 web page 가 다운되는 것이다 )


- 중요한 구조체인 Event Loop 는 Node.js 가 시작되면 자동으로 시작된다


- Event Loop 는 Event Callback 을 다룬다


- 특정 event 가 일어났을때, Event Loop 가 해당 event 를 처리한다
  - ( 모든 콜백을 파악하고 있어서 코드를 실행한다 )


- 그러나 시간이 오래걸리는 파일 연산에는 도움되지 않는다


- Event Loop 는 **파일연산등에 대한 연산들은 다루지 않는다**


- 오직 완성된 쓰기 파일에 정의한 콜백에 대한 코드들만 처리한다
  - ( 금방 끝낼 수 있는 코드들 )


- 대신 파일 시스템 연산등의 오래걸리는 연산은 Worker Pool( 워커 풀 )에 보내진다
  - ( 이 역시 Node.js 가 자동으로 시작하고 관리한다 )


- 무거운 작업을 담당하는 Worker Pool 은 
  - Javascript 코드로부터 완전히 분리되어 
  - 다른 여러 스레드에서 작동할 수 있다
  - ( 앱을 실행하는 운영 체제와 연관이 있다 )


- 코드로부터 분리되어 있기 때문에 무거운 작업을 처리할 수 있다


- 파일과 관련된 작업을 할 때는, 
  - Worker Pool 의 Worker 가 코드, 요청 , Event Loop 와 
  - 분리된 상태에서 작업을 수행한다


- 그러나 Event Loop 와는 한가지 연결점이 있다
  - Worker 가 작업을 끝마치면, 
  - 예를들어 파일 읽기를 마치면 읽기 파일연산에 대한 콜백이 실행되는데
  - EventLoop 가 event 와 callback 을 책임지기 때문에,
  - 결국 Event Loop 에 들어가게 될 것이다


- Node.js 가 알맞은 callback 을 실행시킨다


- 이렇게 배후에서는 많은 일이 일어나지만 실제로 이런 수행들을 code 로 작성할 필요가 없다

---

### The Event Loop

>
> **Event Loop**
> 
>> **Timers**
>>
>> Execute setTimeout,
>>
>> setInterval Callbacks
> 
>> **Pending Callbacks**
>>
>> Execute I/O-related
>>
>> ( I/O : Input & Output ) : Disk & Network Operations
>>
>> Callbacks that were deferred
>
>> **Poll**
>>
>> Retrieve new I/O events,
>>
>> execute their callbacks
>
>> **Check**
>>
>> Execute setImmediate()
>>
>> callbacks
>
>> **Close Callbacks**
>>
>> Execute all 'close' event
>>
>> callbacks
> 
> ( refs === 0 ) -->
> 
> **process.exit** 

- Loop Cycle

---

#### Timers


- Event Loop 란 Node.js 에 의해 실행되어 


- Node.js 를 계속 실행하도록 하는 Loop 로 모든 callback 을 처리한다


- 또한 callback 을 처리하는데 일정한 순서가 있다
  - ( Looping 을 계속하는 Loop! )


- 새로운 Loop 가 시작될 때마다 실행해야하는 TimerCallback 이 있는지 체크한다


- setTimeout 을 설정하면, 타이머가 끝나면 실행할 콜백을 Node.js 가 알고 있어서,


- 새로운 Loop 가 일어날 때마다, setTimeout callback 을 실행할 것이다

---

#### Pending Callbacks

- 다음으로 다른 callback 등을 체크하는데 
  - 예를 들어 읽기, 쓰기 파일의 연산이 끝나 callback 이 있을 수 있는데, 
  - 이런 callback 을 실행한다


- **I/O** ( input & output ) : 읽기 쓰기등 보통 오래걸리는 블로킹 연산을 가르킨다


- 이때, Node.js 가 적절한 시점에 이 단계를 떠나는데, 


- 만약, 처리되지 않은 callback 이 너무 많이 있다면,


- Loop 를 이어가는 대신, 남은 callback 을 다음 Loop 에서 실행하도록 미룬다

---

#### Poll

- 이렇게 열린 callback 들을 다 처리하고 나면, **Poll** 단계에 돌입하게 된다


- Poll 단계에서는 Node.js 가 새로운 I/O 이벤트를 찾아 최대한 해당 event 의 callback 을 빨리 실행하도록 한다


- 불가능하다면 실행을 미루고, Pending Callbacks 로 등록하게 된다


- 또한 Timer 가 다되어 실행해야하는 callback 도 확인하는데, 
  - 만약, 존재한다면 Timers 단계로 넘어가 바로 실행하기도 한다
  - ( 즉, Loop 를 이어가지 않고 다시 돌아가기도 한다 )


- 만약 없다면 Loop 가 계속된다

---

#### Check

- Check 단계에서는 setImmediate callback 이 실행된다


- setImmediate : 
  - setTimeout 이나, setInterval 처럼 바로 실행되기는 하지만,
  - 반드시 열린 callback 들이 모두 실행된 다음에 실행된다


- 보통 setTimeout 보다 1ms 만큼 빠르지만, 현재 주기가 끝나거나, 


- 적어도 현 반복에 열린 callback 을 처리한 후에 일어난다


- 그 후에는 이론적인 단계로 들어선다

---

#### Close Callbacks

- 이제 close event callback 이 모두 실행된다


- close event callback 을 등록했다면, 이시점에 해당 callback 을 실행한다

---

#### 정리

- 먼저 Timer callback 을 실행하고, 


- I/O 관련 callback 및 다른 event callback 을 실행 및


- setImmediate callback 을 실행 후


- 마지막으로 close event callback 을 실행한다
  - ( close event callback 은 따로 처리하게 된다 )

---

#### process.exit

- 그 후, 프로그람을 종료하는데 그 전에 등록한 event handler 가 남아있는지 확실히 해야한다


- Node.js 는 내부적으로 열린 event Listener 를 추적해서,


- references 나 ref 로 숫자를 센다


- 새로운 callback 이 등록되거나, 새로운 event listener 가 등록될 때마다 1 씩 증가한다 
  - ( 추후 처리해야할 작업이 늘어날때마다... )


- 반대로 eventListener 가 필요없어지거나, 콜백이 완료될때마다 1 씩 감소한다


- 특히, server 환경에서( createServer ) listen 을 통해 들어오는 요청을 듣는 event 들은


- 절대 끝나지 않는 event 이기 때문에, **refs 는 항상 1 이상일 것이다**


---

### 보안

- createServer 의 listen 메서드의 callback 은 들어오는 새 요청마다 실행되고,


- 해당 요청에만 실행된다는 뜻이므로, 요청 및 응답 객체에 어떤 작업을 해도,


- 다른 요청 및 응답 객체에는 유출되지 않는다


- 즉, 각 가능의 범위를 다른 기능이 접근할 수 없고, 


- JS 원리에 따라 기본으로 분리가 되어있는 것이다

---

### routes.js

````javascript
/** 
 * @test.js
 * 
 * - Node.js 전역객체인 Module 
 *   객체에 export 하면 require 로 사용할 수 있다
 * 
 * */
module.export = myObject;

/**
 * @test.js
 *
 * - 이와 같은 방식으로도 내보낼 수 있다
 *
 * */
module.export.myObject = myObject;
/**
 * - 앞에 module 을 생략해도된다
 */
exports.myObject = myObject;

/**
 * @app.js
 * 
 * - 글로벌 모듈이 아니기 때문에 사용할때는,
 *   해당 파일 경로를 입력한다
 */
require( './test.js' );

````

- url 확인등 라우팅 로직을 포함한 파일


- url 라우팅 관련 로직을 분리한다


- 그 후 createServer 콜백 핸들러에 해당 import 한 함수를 사용한다


- Node.js 의 모듈 시스템에서 중요한 점은 파일 내용의 캐시가 저장되고, 외부에서 수정할 수 없다는 것이다
  - ( 만약 위 코드의 routes 객체에 새로운 프로퍼티를 추가할 수 없다 )
  

---

### Module Summary

#### Program Lifecycle & Event Loop

- Node.js 는 non-blocking 방식으로 동작한다
  - non-blocking 방식 :
  - 즉, **함수를 호출하더라도, 그함수의 완료여부를 신경쓰지 않고 계속 진행**
  - ( 제어권을 해당 함수에 넘겨주지 않음 )
  - 단지 동기상태일때는 그 함수가 완료되었는지 자꾸 물어봐고 완료되면 다음코드를 실행함


- 수많은 callback 과 event 들을 등록해두면, 특정 작업이 끝난 후에


- Node.js 가 해당 코드를 작동시킨다


- loop 는 계속해서 새로운 event 를 기다리다가, 


- event 가 발생하면, 운영체제가 어떤 조치를 취할 수 있도록 한다음, 스레드를 비운다

#### Asynchronous Code

- JS 코드는 non-blocking 방식이어야 해서, 


- callback 등 event 기반 방식을 이용한다
  - 코드가 바로 실행되서 메인 스레드가 막히지 않도록
  - 등록해서 나중에 실행하게 한다


- **어느 경우에도 메인 스레드가 막히면 안되게 설계되어 있다**

#### Requests & Response

- 요청 데이터안의 chunks 들을 파싱
  - ( Streams , Buffer )


- 중복 응답을 보내지 않게 조심해야 한다
  - 하나의 res 가 끝난 후 다른 res 를 보내지 않아야하는데,
  - 비동기식 특성에 따라, 바로 실행되지 않을 수 있다는 사실을
  - 잊으면 실수하기 쉽다


- 따라서, 코드를 어디에 작성하느냐가 중요하다( callback 등... )

#### Node.js & Core Modules

- Node.js 에는 내장된 글로벌 코어 모듈을 주로 사용한다
  - ( http , fs , path ... )


- coreModule 로 exports 를하고 require 로 불러올 수 있다

---

- 공식 Node.js 자료: https://nodejs.org/en/docs/guides/


- 모든 코어 모듈에 대한 Node.js 참고자료: https://nodejs.org/dist/latest/docs/api/


- Node.js 이벤트 루프 추가자료: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/


- 블로킹 및 논블로킹 코드:https://nodejs.org/en/docs/guides/dont-block-the-event-loop/