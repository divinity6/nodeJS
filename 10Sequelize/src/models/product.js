const Sequelize = require( 'sequelize' );

const sequelize = require( '../util/database' );

/**
 * - 제품 단일 Model Table
 */
const Product = sequelize.define( 'product' , {
    id : {
        type : Sequelize.INTEGER,   // id 타입
        autoIncrement : true,   // 자동증가
        allowNull : false,      // null 을 허용함
        primaryKey : true,      // id 를 테이블의 기본 키로 설정
    },
    title : Sequelize.STRING,   // 유형만 설정( 세부설정 안할경우 )
    price : {
        type : Sequelize.DOUBLE,
        allowNull: false,
    },
    imageUrl : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    description : {
        type : Sequelize.STRING,
        allowNull : false,
    }
} );

module.exports = Product;