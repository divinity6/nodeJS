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

### install( 2.1.1 ver )

- 가장 유명한 socket.io 라이브러리를 사용한다
  - 클라이언트에서 서버에 들어간 웹 소켓 채널을 쉽게 
  - 생성하고, 사용할 수 있게 도와주는 패키지다


- 웹 소켓 프로토콜을 배후에서 편하게 사용할 수 있도록 설정해준다
  - Socket.io 를 설정할때는 서버와 클라이언트 둘 다 설치한다
  - ( 서로 통신해야하기 때문에 )
  

- 현재 2.1.1 버전 기준으로 작성되어 있음

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

- client 에는 socket.io-client 를 설치한다
  - ( 클라이언트에서 실행될 코드들만 포함한다 )

````shell
npm i socket.io-client
````

- npm workspaces 일 경우

````shell
npm i socket.io-client --workspace=<< 워크스페이스_이름 >>
````

- 그 후, import 하여 해당 socket 서버 주소를 입력후 연결하면 된다


````javascript
/** ========== frontend ========== */
/** ===== pages/Feed/Feed.js ===== */
import openSocket from 'socket.io-client';

/** 해당 웹 소켓을 구현할때, 웹소켓이 연결된 서버의 포트를 입력한다 */
openSocket( `http://localhost:8080` );
````

- 이제 다른 사용자가 Post 를 추가하게 되면, 


- 해당 요청을 받아서 websocket 에 연결된 클라이언트들에 통지해줘야 한다


- 따라서, 현재 app.js 에서 연결된 websocket.io 객체를 feed.js 에서 사용할 수 있도록 공유해야 한다


- 그러므로 기존에 app.js 에서 선언한 Socket.io 를 저장할 파일을 생성하고, 여러곳에서 사용할 수 있도록 한다

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

    /** socket 연결 */
    const io = require( './socket' ).init( server );

    /** 새로운 클라이언트가 연결될 때마다... */
    io.on( 'connection' , socket => {
      console.log( "<< ConnectedWebSocket >>" );
    } );
  } )
  .catch( err => {
    console.log("<<StartApp Err>>", err);
  } );
````

- app.js 에서는 socket.js 를 불러와 설정하고, socket.js 파일에 io 인스턴스를 저장한다

````javascript
/** ===== socket.js ===== */
/** SocketIO 인스턴스를 여러곳에서 사용할 수 있도록 선언 */
let io;

/** socket 관련한 모듈을 작성하여 반환한다 */
module.exports = {
  /** DB 를 연결한 후, 서버를 시작한 후에 Socket.io 를 연결하는 것이 좋다 */
  init : httpServer => {
    io = require( 'socket.io' )( httpServer );

    return io;
  },
  getIO : () => {
    if ( !io ){
      throw new Error( 'Socket.io not initialized!' );
    }
    return io;
  }
};
````

- 이제 사용하는 feed.js 에서 해당 Socket.io 인스턴스가 저장된 객체를 불러와야 한다


- Socket.io 인스턴스의 메서드
  - **emit** : 연결된 모든 사용자에게 메시지를 발신한다
  - **broadcast** : 요청이 발신된 사용자 외의 모든 사용자에게 발신한다
  

````javascript
/** ===== controllers/feed.js ===== */
const io = require( '../socket' );

/**
 * - 게시물을 생성하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.createPost = async ( req , res , next ) => {
  /** ~~ 데이터 저장로직 */
  await user.save();

  /**
   * - webSocket 에 연결된 모든 사용자에게 메시지를 발신한다
   *
   * @param { string } posts - 이벤트 이름
   * @param { any } data - 전달할 데이터
   */
  io.getIO().emit( 'posts' , {
    action : 'create',
    post : {
      ...post._doc,
      creator : { _id : req.userId , name : user.name } }
  } );
}
````

- emit 이나 , broadcast 를 할때, 발신하는 이름을 지정하면, 


- 수신하는 곳에서는 같은 이름을 사용하여 이벤트를 수신할 수 있다

````javascript
/** ========== frontend ========== */
/** ===== pages/Feed/Feed.js ===== */
import openSocket from 'socket.io-client';

class Feed extends Component {
    
  componentDidMount() {
    /** 해당 웹 소켓을 구현할때, 웹소켓이 연결된 서버의 포트를 입력한다 */
    const socket = openSocket( `http://localhost:8080` );

    /** 서버에서 보낸 socket posts 이벤트 수신 */
    socket.on( 'posts' , data => {
      if ( 'create' === data.action ){
        this.addPost( data.post );
      }
      else if ( 'update' === data.action ){
        this.updatePost( data.post );
      }
      else if ( 'delete' === data.action ){
        this.loadPosts();
      }
    } );
  }
}
````

- 이렇게 socket.io 를 통하여, 이벤트를 수신하여 페이지를 동적으로 업데이트할 수 있다


- 게시물을 업데이트, 제거등 모든 곳에서 활용 가능하다

````javascript
/** ===== controllers/feed.js ===== */
const io = require( '../socket' );

/**
 * - 단일 게시물 업데이트 Controller
 * @param req
 * @param res
 * @param next
 */
exports.updatePost = async ( req , res , next ) => {

  const result = await post.save();
  
  /** 모든 저장로직을 마치고 데이터를 반환할때 websocket 메시지로 반환한다 */
  /**
   * - webSocket 에 연결된 모든 사용자에게 메시지를 발신한다
   *
   * @param { string } posts - 이벤트 이름
   * @param { any } data - 전달할 데이터
   */
  io.getIO().emit( 'posts' , {
    action : 'update',
    post : result
  } );
}
````

- 게시물을 제거할때는, 제거한 모든 객체가 필요없으므로, 제거한 id 만 반환해주면 된다

````javascript
/** ===== controllers/feed.js ===== */
const io = require( '../socket' );

/**
 * - 단일 게시물 삭제 Controller
 * @param req
 * @param res
 * @param next
 */
exports.deletePost = async ( req , res , next ) => {

  await user.save();
  
  /** 모든 저장로직을 마치고 데이터를 반환할때 websocket 메시지로 반환한다 */
  /**
   * - webSocket 에 연결된 모든 사용자에게 메시지를 발신한다
   *
   * @param { string } posts - 이벤트 이름
   * @param { any } data - 전달할 데이터
   */
  io.getIO().emit( 'posts' , {
    action : 'delete',
    post : postId,
  } )
}
````

- 또한, 데이터를 저장하고나서, 다시 리로드시 데이터 정렬이 맞지 않는 현상이 있다


- 해당 현상은 , DB 에서 생성일시 순으로 데이터를 가져오면 해결된다

````javascript
/** ===== controllers/feed.js ===== */
/**
 * - 게시물 목록을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = async ( req , res , next ) => {

  /** 모든 Posts 를 찾아 반환 */
  const posts = await Post.find()
    /** 참조 중인 User 테이블에서 creator 필드를 채워서 반환 */
    .populate('creator')
    /** 데이터를 내림차순 정렬 - 최근에 작성된 순으로 정렬하여 반환 */
    .sort( { createdAt : -1 } )
    /**
     * - skip 메서드를 추가하면,
     *   find 로 찾은 결과중 첫 번째부터 skip 갯수만큼 생략한다
     */
    .skip( ( currentPage - 1 ) * perPage )
    /**
     * - limit 메서드는 find 로 가져오는 데이터양을 지정할 수 있다
     */
    .limit( perPage )
};
````

- WebSocket 프로토콜이 배후에서 데이터를 프론트엔드로 데이터를 push 해준다


- WebSocket 은 HTTP 프로토콜에 기반한 것으로, HTTP 핸드세이크로 설정되므로


- HTTP 서버를 실행해야 하며, 해당 서버에 Websocket 을 연결하여, 둘을 동시에 실행하는 것이다

---

- Socket.io 공식 참고자료 : https://socket.io/get-started/chat/


- Websocket Library의 대안 : https://www.npmjs.com/package/express-ws