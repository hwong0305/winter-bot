import { Client, Intents, MessageEmbed } from 'discord.js'
import { fetchWeatherData } from './lib/fetchowp'
import 'dotenv/config'

import { weatherSymbol as weatherDescToIconMap } from './iconMap'
import initDb from './init'
import { findUser, updateUser } from './dao/user'

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
        // TODO: Move away from wttr.in which is has been reaching capacity 2/23/22
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
            console.log(data)
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
            const weatherDescription: string =
              currentCondition.weatherDesc[0].value

            // Using MessageEmbed API
            const embed = new MessageEmbed()
              .setColor('#0099ff')
              .setTitle(`Weather in ${data.request[0].query}`)
              .setTimestamp()
              .addField(
                'Currently',
                `${
                  weatherDescToIconMap[
                    weatherDescription.split(' ').join('').toLowerCase()
                  ] || ''
                } **${weatherDescription}**\n:thermometer: Temperature **${temp_C} °C** (${temp_F} °F), Feels Like: **${FeelsLikeC} °C** (${FeelsLikeF} °F)\n:wind_blowing_face: Wind ${windspeedKmph} km/h (${windspeedMiles} mph)\n:sweat_drops: Humidity: ${humidity}%`
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
