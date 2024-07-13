const User = require('../models/User')

const findUser = async id => {
  const user = await User.findOne({
    where: {
      userId: id
    }
  })

  if (!user) {
    return { success: false }
  }
  return { success: true, user }
}

const updateUser = async (id, location) => {
  const [user] = await User.findOrCreate({
    where: { userId: id },
    defaults: { userId: id, location }
  })

  return {
    success: true,
    user
  }
}

module.exports.findUser = findUser
module.exports.updateUser = updateUser
