const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { updateUser } = require('../../lib/user')
const { fetchWeather } = require('../../lib/fetchOWP')
const { getIconFromCode } = require('../../lib/map')

const convertCtoF = temp => temp * 1.8 + 32

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Sets the default location')
    .addStringOption(option =>
      option
        .setName('location')
        .setDescription('location of the weather report')
        .setRequired(true)
    ),
  execute: async interaction => {
    const initialLocation = interaction.options.getString('location')
    const data = await fetchWeather(initialLocation)

    if (!data) {
      throw new Error()
    }

    if (!('base' in data)) {
      return interaction.reply(
        "I can't find the location you are looking for. :thinking:"
      )
    }

    const humidity = data.main.humidity
    const temp_C = +data.main.temp - 273
    const temp_F = Math.floor(convertCtoF(temp_C))
    const FeelsLikeC = +data.main.feels_like - 273
    const FeelsLikeF = convertCtoF(FeelsLikeC)
    const windSpeed = data.wind.speed
    const windSpeedImperial = (+data.wind.speed * 3600) / 1000

    const weatherIcon =
      data.weather[0].icon === '01d' ? '01d' : data.weather[0].icon.slice(0, 2)

    const embed = new EmbedBuilder()
      .setColor('#fffff0')
      .setTitle(`Weather in ${data.name}, ${data.sys.country}`)
      .setURL(`https://maps.google.com/?q=${data.coord.lat},${data.coord.lon}`)
      .setTimestamp()
      .addFields({
        name: 'Currently',
        value: `${getIconFromCode(weatherIcon) ?? ''} **${
          data.weather[0].main
        }**\n:thermometer: Temperature **${temp_C.toFixed(
          1
        )} °C** (${Math.floor(temp_F)} °F), Feels Like: **${FeelsLikeC.toFixed(
          1
        )} °C** (${Math.floor(
          FeelsLikeF
        )} °F)\n:wind_blowing_face: Wind ${windSpeed.toFixed(
          2
        )} m/s (${Math.floor(
          windSpeedImperial
        )} mph)\n:sweat_drops: Humidity: ${humidity}%`
      })
      .setFooter({ text: 'created with love for Winter by sfwong445' })

    await updateUser(interaction.user.id, initialLocation)

    return interaction.reply({
      embeds: [embed]
    })
  }
}
