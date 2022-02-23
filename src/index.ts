import { Client, Intents, MessageEmbed } from 'discord.js'
import fetch from 'isomorphic-unfetch'
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
  const commandName = interaction?.commandName
  if (commandName === 'weather') {
    // TODO: Start database for storing location data by userId
    // TODO: Format data
    let location = interaction.options.getString('location') || 'Seoul'!
    fetch(`https://wttr.in/${location}?format=j1`)
      .then(r => r.json())
      .then(async data => {
        console.log(data)
        console.log(data['current_condition'])
      })
      .catch(err => {
        console.log(err)
      })
    // const payload = new MessagePayload(interaction.user, {})
    // payload.data = await interaction.reply(MessagePayload(interaction.user))
    // TODO: Default reply
    await interaction.reply('https://gfycat.com/concernedwelllitisopod')
  }
})

client.login(token)
