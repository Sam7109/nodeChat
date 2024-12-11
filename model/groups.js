const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq');

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,  // Assuming this references the user who created the group
        allowNull: false,
    }
});

module.exports = Group;
