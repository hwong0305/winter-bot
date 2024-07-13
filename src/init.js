const User = require('./models/User')
const isDev = process.env.NODE_ENV === 'development'

module.exports = async function () {
  return User.sync({ alter: isDev })
}
