## WebSocket

- 웹 소켓은 실시간 웹 서비스를 구축 가능하게 하는 프로토콜의 일종이다
  - socket.io 라이브러리를 이용하여 구현한다


- 일반적인 웹 어플리케이션은 요청이 들어오고, 로직을 처리한다음, 응답을 반환하는 방식으로 동작한다
  - pull 방식( 즉, 클라이언트에서 서버에 pull( 정보를 당겨옴 )해 온다 )


- 그렇다면, 서버에서 클라이언트로 무언가를 보내고 싶다면 어떻게 해야하는가? 
  - 예시 ) 채팅
  - 일반 채팅을 pull 방식으로 구현하게 되면, 클라이언트는 서버에 새로운 메시지가 있는지,
  - 주기적으로 체크해야한다( 서버에 많은 request 로 부담을 안기게 된다 )
  - push 방식( 즉, 다른 사용자에게 새로운 메시지를 push 한다 )


- 이럴경우 HTTP 프로토콜 대신 WebSocket 을 사용하면 된다
  - ( WebSocket 도 HTTP 를 토대로 구축된다 )
  - 단지, HTTP 프로토콜을 내부에서 WebSocket 프로토콜로 업그레이하여, 
  - HTTP 핸드세이크를 사용한다


- 또한, WebSocket 프로토콜은 단순히 데이터 교환에 대해서만 이야기한다.
  - ( 능동적으로 관리할 필요가 없다 )
  - HTTP : 요청 , 응답
  - WebSocket : **Push**


---

### install

- 가장 유명한 socket.io 라이브러리를 사용한다
  - 클라이언트에서 서버에 들어간 웹 소켓 채널을 쉽게 
  - 생성하고, 사용할 수 있게 도와주는 패키지다


- 웹 소켓 프로토콜을 배후에서 편하게 사용할 수 있도록 설정해준다
  - Socket.io 를 설정할때는 서버와 클라이언트 둘 다 설치한다
  - ( 서로 통신해야하기 때문에 )
  


````shell
npm i socket.io
````

- npm workspaces 일 경우

````shell
npm i socket.io --workspace=<< 워크스페이스_이름 >>
````

---

- socket.io 를 연결할때는 DB 를 연결하고, 서버를 시작한 후에 Socket 을 연결하는 것이 일반적이다
  - 왜냐하면, app.listen 메서드는 실제 **노드 서버 앱을 반환**하는데, 해당 앱을 Socket 에서 요구하기 때문이다


- http 서버를 사용하여( WebSocket 이 HTTP 서버를 사용하기 때문에 ) HTTP 프로토콜을 기반으로 웹 소켓 연결을 구축한다
  - socket.io 파라미터에 NodeApp 을 넘기면 배후에서 Socket 설정을 모두 설정해준다


````javascript
/** ===== app.js ===== */
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const app = express();

mongoose
    .connect( privateKeys.MONGODB_URI )
    .then( () => {
        const server = app.listen( 8080 );
        console.log( "<< StartWebApplication >>" );

        /** DB 를 연결한 후, 서버를 시작한 후에 Socket.io 를 연결하는 것이 좋다 */
        const io = require( 'socket.io' )( server );
    } )
    .catch( err => {
        console.log("<<StartApp Err>>", err);
    } );
````

- 해당 소켓에 연결되었다면, 새로운 이벤트를 등록할 수 있는데, 


- 예시로 connect 이벤트리스너는 새로운 클라이언트가 연결될 때마다, 특정 함수를 실행할 수 있다


````javascript
/** ===== app.js ===== */
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const app = express();

mongoose
    .connect( privateKeys.MONGODB_URI )
    .then( () => {
        const server = app.listen( 8080 );
        console.log( "<< StartWebApplication >>" );

        /** DB 를 연결한 후, 서버를 시작한 후에 Socket.io 를 연결하는 것이 좋다 */
        const io = require( 'socket.io' )( server );

        /** 새로운 클라이언트가 연결될 때마다... */
        io.on( 'connection' , socket => {
          console.log( "<< Client Connected >>" );
        } );
    } )
    .catch( err => {
        console.log("<<StartApp Err>>", err);
    } );
````

- 이제, client 에도 해당 해당 소켓을 연결하면 된다