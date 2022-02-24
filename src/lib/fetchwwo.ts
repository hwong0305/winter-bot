import fetch from 'isomorphic-unfetch'
import 'dotenv/config'

const URL =
  'https://api.worldweatheronline.com/premium/v1/weather.ashx?num_of_days=1&format=json'
const key = process.env.WWO_API_KEY

export const fetchWeatherData = async (location: string) => {
  const response = await fetch(`${URL}&key=${key}&q=${location}`)
  const responseJson = await response.json()
  return responseJson.data
}
