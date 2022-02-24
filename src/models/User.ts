import { Model, Optional, DataTypes, CreateOptions } from 'sequelize'
import { sequelize } from './'

type UserAttributes = {
  id: number
  userId: string
  location: string
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: CreateOptions<number>
  declare userId: string
  declare location: string

  // timestamps!
  declare createdAt: CreateOptions<Date>
  declare updatedAt: CreateOptions<Date>
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    location: {
      type: new DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
)
