/**
 * - 이곳에서 mySQL 과 연결하고, 쿼리를 실행하게 하는 연결 객체를 전달받도록 한다
 */
const mysql = require( 'mysql2' );

/**
 * - 단일 연결이 아닌, pool 로 설정해서,
 *   실행할 쿼리가 있을때마다 항상 활용할 수 있게하는것이 좋다
 *
 * - 그렇지 않을경우, 매쿼리마다 연결 , 연결끊기를 실행해야 한다
 *
 * - Pool 을 이용하면 다중  쿼리연결을 지원해준다
 */
const pool = mysql.createPool( {
    host : 'localhost',
    user : 'root',
    database : 'node_complete',
    password : 'Tpsl782505@'
} );

module.exports = pool.promise();