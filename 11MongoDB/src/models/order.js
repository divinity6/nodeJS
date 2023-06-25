const Sequelize = require( 'sequelize' );

const sequelize = require( '../util/database' );

/**
 * - Cart 와 같은 구조를 가지게 된다
 */
const Order = sequelize.define( 'order' , {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    quantity : Sequelize.INTEGER,
} )

module.exports = Order;