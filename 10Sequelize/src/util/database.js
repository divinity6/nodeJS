const Sequelize = require( 'sequelize' );

/**
 * - table 명
 *
 * - username
 *
 * - password
 *
 * - options
 */
const sequelize = new Sequelize( 'node_complete', 'root' , 'Tpsl782505@' , {
    dialect : 'mysql',
    host : 'localhost'
} );

/**
 * - 이렇게 설정하면 자동으로 sequelize 객체가 생성되어 db 에 자동으로 연결될 것이다
 *
 * --> 정확히는 ConnectionPool 을 자동으로 생성한다
 */
module.exports = sequelize;