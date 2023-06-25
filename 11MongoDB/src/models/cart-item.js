const Sequelize = require( 'sequelize' );

const sequelize = require( '../util/database' );

const CartItem = sequelize.define( 'cartItem' , {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    /** 카트 아이템 수량 */
    quantity : Sequelize.INTEGER,
} )

module.exports = CartItem;