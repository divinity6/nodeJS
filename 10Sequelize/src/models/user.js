const Sequelize = require( 'sequelize' );

const sequelize = require( '../util/database' );

/**
 * - 더미 사용자 Model Table
 */
const User = sequelize.define( 'user' , {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
    },
    name : Sequelize.STRING,
    email : Sequelize.STRING,
} );

module.exports = User;