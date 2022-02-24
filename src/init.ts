import { User } from './models/User'

const isDev = process.env.NODE_ENV === 'development'

export default async function () {
  return User.sync({ alter: isDev })
}
