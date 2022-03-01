export interface OwpWeatherResponse {
  coord: {
    lon: Number
    lat: Number
  }
  weather: {
    id: Number
    main: string
    description: string
    icon: string
  }[]
  base: string
  main: {
    temp: Number // Kelvin
    feels_like: Number // Kelvin
    temp_min: Number // Kelvin
    temp_max: Number // Kelvin
    pressure: Number // Pascal
    humidity: Number // Percentage
    sea_level: Number
    grnd_level: Number
  }
  visibility: Number
  wind: {
    speed: Number
    deg: Number
    gust: Number
  }
  clouds: {
    all: Number
  }
  dt: Number
  sys: {
    country: string
    sunrise: Number
    sunset: Number
  }
  timezone: Number
  id: Number
  name: string
  cod: Number
}
