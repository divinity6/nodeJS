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