const fetch = require('node-fetch')
const { parseStateCode } = require('./code')
const logger = require('./logger')
require('dotenv').config()

const URI = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OWP_API_KEY}`

const fetchWeather = async location => {
  try {
    const locationArr = location.split(',')
    let parsedLocation

    if (locationArr.length > 1) {
      parsedLocation =
        locationArr[0] +
        ',' +
        parseStateCode(locationArr[1].trim()) +
        locationArr.slice(2).join('')
    } else {
      parsedLocation = location
    }

    const r = await fetch(`${URI}&q=${encodeURIComponent(parsedLocation)}`)
    if (!r.ok) {
      return { status: 404 }
    }
    return r.json()
  } catch (e) {
    logger.error(e)
  }
}

module.exports.fetchWeather = fetchWeather
