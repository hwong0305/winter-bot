import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import 'dotenv/config'

const token = process.env.DISCORD_TOKEN!
const clientId = process.env.CLIENT_ID!
const guildId = process.env.GUILD_ID!

const commands = [
  new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Replies with weather')
    .addStringOption(option =>
      option.setName('location').setDescription('location you want the weather')
    )
].map(command => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token)

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => {
    console.log('Successfully registered application commands.')
  })
  .catch(err => {
    console.error(err)
  })
