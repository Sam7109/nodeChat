const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq')

const Userdetails = sequelize.define('Users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true  // Make sure username is unique
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true  // Ensures the email is in the correct format
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]  // Ensure mobile number has exactly 10 digits
        }
    }
});

module.exports = Userdetails