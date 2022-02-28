import fetch from 'isomorphic-unfetch'
import 'dotenv/config'
import { OwpWeatherResponse } from 'src/interface/response'

const { OWP_API_KEY } = process.env
if (!OWP_API_KEY) throw new Error('Invalid API key')

const URI = `https://api.openweathermap.org/data/2.5/weather?appid=${OWP_API_KEY}`

export const fetchWeatherData = async (
  location: string
): Promise<OwpWeatherResponse | null> => {
  try {
    const response = await fetch(`${URI}&q=${location}`)
    if (!response.ok) throw new Error('fetching error')
    const responseJson = await response.json()
    return responseJson
  } catch (err) {
    console.error(err)
    return null
  }
}
