const { Sequelize } = require('sequelize')
const logger = require('../lib/logger')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite',
  logging: msg => logger.info(msg)
})

module.exports = sequelize
