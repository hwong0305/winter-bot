import fetch from 'isomorphic-unfetch'
import 'dotenv/config'
import { OwpWeatherResponse } from 'src/interface/response'
import { parseStateCode } from './tempUtil'

import { logger } from './logger'

const { OWP_API_KEY } = process.env
if (!OWP_API_KEY) throw new Error('Invalid API key')

const URI = `https://api.openweathermap.org/data/2.5/weather?appid=${OWP_API_KEY}`

export const fetchWeatherData = async (
  location: string
): Promise<
  | OwpWeatherResponse
  | {
      status: number
    }
  | null
> => {
  try {
    const locationArr = location.split(',')
    let parsedLocation

    if (locationArr.length > 1) {
      parsedLocation = locationArr[0] + ','
      parseStateCode(locationArr[1].trim()) +
        location.split(',').slice(2).join('')
    } else {
      parsedLocation = location
    }

    const response = await fetch(`${URI}&q=${encodeURI(parsedLocation)}`)
    if (!response.ok) {
      return { status: 404 }
    }
    const responseJson = await response.json()
    return responseJson
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message)
    } else {
      logger.error(JSON.stringify(err))
    }
    return null
  }
}
