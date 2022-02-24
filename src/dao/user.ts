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

export const createUser = async (id: string, location: string) => {
  const payload = {
    userId: id,
    location
  }

  const user = await User.create(payload).catch(err => {
    console.error(err)
  })

  if (!user?.id) {
    return { success: false }
  }

  return { success: true, user: user.id }
}

export const updateUser = async (id: string, location: string) => {
  const user = await User.findOne({ where: { userId: id } })

  if (!user) return { success: false }

  user.location = location

  await user.save()
  return {
    success: true,
    user: user.id
  }
}
