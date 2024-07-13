const { DataTypes } = require('sequelize')
const sequelize = require('./')

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = User
