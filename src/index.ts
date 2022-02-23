import { Client, Intents, MessageEmbed } from 'discord.js'
import fetch from 'isomorphic-unfetch'
import 'dotenv/config'

const token = process.env.DISCORD_TOKEN
const weatherDescToIconMap: { [key: string]: string } = {
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
      .then(data => {
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
        const weatherDescription: string = currentCondition.weatherDesc[0].value

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`Weather in ${location}`)
          .setTimestamp()
          .addField(
            'Currently',
            `${weatherDescToIconMap[weatherDescription.toLowerCase()] || ''}
             **${weatherDescription}**\n:thermometer: Temperature **${temp_C} °C** (${temp_F} °F), Feels Like: **${FeelsLikeC} °C** (${FeelsLikeF} °F)\n:wind_blowing_face: Wind ${windspeedKmph} km/h (${windspeedMiles} mph)\n:sweat_drops: Humidity: ${humidity}%`
          )
          .setFooter({ text: 'powered by wttr.in' })

        interaction.reply({ embeds: [embed] })
      })
      .catch(err => {
        console.log(err)
      })
    /**
     * Using MessageEmbed API
     */

    // TODO: Default reply
    // await interaction.reply('https://gfycat.com/concernedwelllitisopod')
    // await interaction.reply({ embeds: [embed] })
  }
})

client.login(token)
