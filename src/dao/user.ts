import { User } from '../models/User'

export const findUser = async (id: string) => {
  const user = await User.findOne({
    where: {
      userId: id
    }
  })

  if (!user) return { success: false }
  return { success: true, user: user }
}

export const updateUser = async (id: string, location: string) => {
  const [user, created] = await User.findOrCreate({
    where: { userId: id },
    defaults: { userId: id, location }
  })

  if (!created) {
    user.location = location
  }
  await user.save()

  return {
    success: true,
    user: user.id
  }
}
