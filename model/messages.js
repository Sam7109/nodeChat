const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq');

const Messages = sequelize.define('Messages', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,       
        autoIncrement: true,     
        allowNull: false,      
    },
    userid: {
        type: DataTypes.INTEGER, // Corrected from INT to INTEGER
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,   // Corrected from STRING to STRING
        allowNull: false,
    }
})


module.exports = Messages;
