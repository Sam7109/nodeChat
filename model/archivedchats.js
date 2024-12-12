const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq');

const ArchivedChats = sequelize.define('ArchivedChats', {
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
    allowNull: false,  // The message content
  },
  originalMessageId: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Reference to the original message that was archived
  },
  archivedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,  // Timestamp when the message was archived
  },
});

module.exports = ArchivedChats;
