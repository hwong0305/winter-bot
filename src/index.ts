import { Client, Intents } from 'discord.js'
import 'dotenv/config'

const token = process.env.DISCORD_TOKEN
console.log('Bot is starting...')

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
  restRequestTimeout: 30000
})

client.once('ready', () => {
  console.log('Ready!')
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return
  console.log(interaction.options)
  const commandName = interaction?.commandName

  if (commandName === 'weather') {
    await interaction.reply(
      'https://gfycat.com/alertacademicamericanpainthorse'
    )
  }
})

client.login(token)
