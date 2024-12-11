const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq');

const GroupMember = sequelize.define('GroupMember', {
    userid: {
      type: DataTypes.INTEGER,  // userId from Userdetails
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,  // groupId from Group
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'member'),  // Role of the user in the group
      defaultValue: 'member',
      allowNull: false,
    },
  }, {
    timestamps: true,
  });
  
  module.exports = GroupMember; 
  