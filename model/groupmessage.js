const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq');

const GroupMessage = sequelize.define('GroupMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Refers to the Group
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Refers to the User
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = GroupMessage;
