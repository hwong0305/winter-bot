import fetch from 'isomorphic-unfetch'
import 'dotenv/config'

const { OWP_API_KEY } = process.env

if (!OWP_API_KEY) throw new Error('Invalid API key')

const URI = `https://api.openweathermap.org/data/2.5/weather?appid=${OWP_API_KEY}`

export const fetchWeatherData = async (location: string) => {
  try {
    const response = await fetch(`${URI}&q=${location}`)
    const responseJson = await response.json()
    return responseJson.data
  } catch (err) {
    console.error(err)
    return null
  }
}
