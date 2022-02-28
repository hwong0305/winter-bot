import { Client, Intents, MessageEmbed } from 'discord.js'
import { fetchWeatherData } from './lib/fetchowp'
import 'dotenv/config'

import { getIconFromCode } from './iconMap'
import initDb from './init'
import { findUser, updateUser } from './dao/user'
import { convertCtoF } from './lib/tempUtil'

const token = process.env.DISCORD_TOKEN

console.log('Bot is starting...')

initDb()
  .then(() => {
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
        const initialLocation = !!interaction.options.getString('location')
        let location = interaction.options.getString('location')
        const userId = interaction.user.id

        if (!initialLocation) {
          const response = await findUser(userId).catch(async () => {
            await interaction.reply('https://gfycat.com/concernedwelllitisopod')
            return { success: false, user: undefined }
          })

          if (!response || !response.success || !response.user) {
            return interaction.reply(
              'You have not set your location set. Set your location with `/weather {location}`'
            )
          }

          location = response.user?.location
        }

        fetchWeatherData(location!)
          .then(async data => {
            if (!data) throw new Error()
            const humidity = data.main.humidity
            const temp_C = +data.main.temp - 273
            const temp_F = Math.floor(convertCtoF(temp_C))
            const FeelsLikeC = +data.main.feels_like - 273
            const FeelsLikeF = convertCtoF(FeelsLikeC)
            const windSpeed = data.wind.speed
            const windSpeedImperial = (+data.wind.speed * 3600) / 1000

            // Using MessageEmbed API
            const embed = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle(`Weather in ${data.name}, ${data.sys.country}`)
              .setTimestamp()
              .addField(
                'Currently',
                `${getIconFromCode(data.weather[0].icon)} **${
                  data.weather[0].main
                }**\n:thermometer: Temperature **${temp_C.toFixed(
                  1
                )} °C** (${Math.floor(
                  temp_F
                )} °F), Feels Like: **${FeelsLikeC.toFixed(
                  1
                )} °C** (${Math.floor(
                  FeelsLikeF
                )} °F)\n:wind_blowing_face: Wind ${windSpeed.toFixed(
                  2
                )} m/s (${Math.floor(
                  windSpeedImperial
                )} mph)\n:sweat_drops: Humidity: ${humidity}%`
              )
              .setFooter({ text: 'created with love for Winter by sfwong445' })

            await updateUser(userId, location!)
            interaction.reply({ embeds: [embed] })
          })
          .catch(async err => {
            console.log(err)
            await interaction.reply('https://gfycat.com/concernedwelllitisopod')
          })
      }
    })

    client.login(token)
  })
  .catch(() => {
    console.log('Error connecting to db')
  })
