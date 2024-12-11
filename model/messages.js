const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq');

const Messages = sequelize.define('Messages', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,       
        autoIncrement: true,     
        allowNull: false,      
    },
    userId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,   
        allowNull: false,
    }
})


module.exports = Messages;
