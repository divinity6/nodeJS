const Sequelize = require( 'sequelize' );

const sequelize = require( '../util/database' );

const OrderItem = sequelize.define( 'orderItem' , {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    /** 주문 아이템 수량 */
    quantity : Sequelize.INTEGER,
} )

module.exports = OrderItem;