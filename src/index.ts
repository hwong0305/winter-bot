import { Client, Intents, MessageEmbed } from 'discord.js'
import fetch from 'isomorphic-unfetch'
import 'dotenv/config'

import { weatherSymbol as weatherDescToIconMap } from './iconMap'

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
    let location = interaction.options.getString('location') || 'icn'!
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
        const nearestArea = data['nearest_area'][0]

        const areaName = nearestArea.areaName[0].value
        const region = nearestArea.region[0].value
        const country = nearestArea.country[0].value

        // Using MessageEmbed API
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(
            `Weather in ${areaName}, ${
              region ? region + ', ' + country : country
            }`
          )
          .setURL(`https://wttr.in/${location}`)
          .setTimestamp()
          .addField(
            'Currently',
            `${
              weatherDescToIconMap[
                weatherDescription.split(' ').join('').toLowerCase()
              ] || ''
            } **${weatherDescription}**\n:thermometer: Temperature **${temp_C} °C** (${temp_F} °F), Feels Like: **${FeelsLikeC} °C** (${FeelsLikeF} °F)\n:wind_blowing_face: Wind ${windspeedKmph} km/h (${windspeedMiles} mph)\n:sweat_drops: Humidity: ${humidity}%`
          )
          .setFooter({ text: 'powered by wttr.in' })

        interaction.reply({ embeds: [embed] })
      })
      .catch(async err => {
        console.log(err)
        await interaction.reply('https://gfycat.com/concernedwelllitisopod')
      })

    // TODO: Default reply
    // await interaction.reply('https://gfycat.com/concernedwelllitisopod')
  }
})

client.login(token)
