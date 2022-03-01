import { Sequelize } from 'sequelize'
import { logger } from '../lib/logger'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: msg => logger.info(msg)
})
