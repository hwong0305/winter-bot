const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { findUser } = require('../../lib/user')
const logger = require('../../lib/logger')
const { fetchWeather } = require('../../lib/fetchOWP')
const { getIconFromCode } = require('../../lib/map')

const convertCtoF = temp => temp * 1.8 + 32

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Replies with weather report')
    .addStringOption(option =>
      option
        .setName('location')
        .setDescription('Location of weather being reported')
    ),
  execute: async interaction => {
    const initialLocation = interaction.options.getString('location')
    const userId = interaction.user.id

    let location
    if (!initialLocation) {
      const response = await findUser(userId).catch(async err => {
        logger.error(err)
        await interaction.reply(
          'https://tenor.com/view/winter-aespa-winter-sleeping-winter-aespa-meme-winter-meme-aespa-meme-gif-26168429'
        )
        return { success: false }
      })

      if (!response || !response.success || !response.user) {
        return interaction.reply(
          'You have not set your location yet. Set your location with `/set {location}`'
        )
      }
      location = response.user.location
    } else {
      location = initialLocation
    }

    const weatherData = await fetchWeather(location)
    if (!weatherData) {
      throw new Error()
    }

    if (!('base' in weatherData)) {
      return interaction.reply(
        "I can't find the location you are looking for. :thinking:"
      )
    }

    const humidity = weatherData.main.humidity
    const temp_C = +weatherData.main.temp - 273
    const temp_F = Math.floor(convertCtoF(temp_C))
    const feelsLikeC = +weatherData.main.feels_like - 273
    const feelsLikeF = convertCtoF(feelsLikeC)
    const windSpeed = weatherData.wind.speed
    const windSpeedImperial = (windSpeed * 3600) / 1000

    const weatherIcon =
      weatherData.weather[0].icon === '01d'
        ? '01d'
        : weatherData.weather[0].icon.slice(0, 2)
    const embed = new EmbedBuilder()
      .setColor('#fffff0')
      .setTitle(`Weather in ${weatherData.name}, ${weatherData.sys.country}`)
      .setURL(
        `https://maps.google.com/?q=${weatherData.coord.lat},${weatherData.coord.lon}`
      )
      .setTimestamp()
      .addFields({
        name: 'Currently',
        value: `${getIconFromCode(weatherIcon) ?? ''} **${
          weatherData.weather[0].main
        }**\n:thermometer: Temperature **${temp_C.toFixed(
          1
        )} °C** (${Math.floor(temp_F)} °F), Feels Like: **${feelsLikeC.toFixed(
          1
        )} °C** (${Math.floor(
          feelsLikeF
        )} °F)\n:wind_blowing_face: Wind ${windSpeed.toFixed(
          2
        )} m/s (${Math.floor(
          windSpeedImperial
        )} mph)\n:sweat_drops: Humidity: ${humidity}%`
      })
      .setFooter({ text: 'created with love for Winter by sfwong445' })

    return interaction.reply({
      embeds: [embed]
    })
  }
}
