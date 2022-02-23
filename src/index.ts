import { Client, Intents, MessageEmbed } from 'discord.js'
import fetch from 'isomorphic-unfetch'
import 'dotenv/config'

const token = process.env.DISCORD_TOKEN
const weatherDescToIconMap = {
  'clear-day': '☀',
  'clear-night': '',
  rain: '🌧',
  snow: '☃',
  sleet: '🌃',
  wind: '🌬',
  fog: '🌁',
  cloudy: '☁',
  'partly-cloudy-day': '⛅',
  'partly-cloudy-night': '☁',
  hail: '🌨',
  thunderstorm: '⛈',
  tornado: '🌪'
}

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
        console.log(location, data['current_condition'])
        const currentCondition = data['current_condition'][0]
        const {
          humidity,
          temp_C,
          temp_F,
          FeelsLikeC,
          FeelsLikeF,
          windspeedKmph,
          windspeedMiles
        } = currentCondition
        const weatherDescription = currentCondition.weatherDesc[0].value

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`Weather in ${location}`)
          .addField('Currently', '')
          .setTimestamp()
      })
      .catch(err => {
        console.log(err)
      })
    /**
     * Using MessageEmbed API
     */

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Weather in ${location}`)
      .setTimestamp()
      .addField(
        'Currently',
        ':cloud: Mostly Cloudy\n:thermometer: Temperature **5.5 C** (42F), Feels Like: **4.6 C** (40F)\n:wind_blowing_face: Wind 1.4 m/s (3.2mph)\n:sweat_drops: Humidity: 68%'
      )
    // TODO: Default reply
    await interaction.reply('https://gfycat.com/concernedwelllitisopod')
    // await interaction.reply({ embeds: [embed] })
  }
})

client.login(token)
