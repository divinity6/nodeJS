/**
 * - 파일관련 helper 유틸
 */
const fs = require( 'fs' );

/**
 * - 파일 경로를 전달하여 해당 경로의 파일을 제거
 * @param { string } filePath - 제거할 파일 경로 + 파일명
 */
const deleteFile = ( filePath ) => {
    /**
     * - 해당 이름과 이름에 연결된 파일을 삭제하는 메서드
     */
    fs.unlink( filePath , ( err ) => {
        if ( err ){
            throw (err);
        }
    } );
}

exports.deleteFile = deleteFile;