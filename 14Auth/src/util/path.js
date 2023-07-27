const path = require( 'path' );

/**
 * - 파일 경로를 추출하는 helper 함수
 */
module.exports = path.dirname( process.mainModule.filename );