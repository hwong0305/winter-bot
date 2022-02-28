export const weatherSymbol: { [key: string]: string } = {
  unknown: '✨',
  cloudy: '☁️',
  fog: '🌫',
  heavyrain: '🌧',
  heavyshowers: '🌧',
  heavysnow: '❄️',
  heavysnowshowers: '❄️',
  lightrain: '🌦',
  lightshowers: '🌦',
  lightsleet: '🌧',
  lightsleetshowers: '🌧',
  lightsnow: '🌨',
  lightsnowshowers: '🌨',
  partlycloudy: '⛅️',
  sunny: '☀️',
  thunderyheavyrain: '🌩',
  thunderyshowers: '⛈',
  thunderysnowShowers: '⛈',
  verycloudy: '☁️'
}

export const getIconFromCode = (icon: string) => {
  const iconCode = icon.slice(0, 2)

  switch (iconCode) {
    case '01':
      return '☀️'
    case '02':
      return '☁️'
    case '03':
      return '⛅️'
    case '04':
      return '⛅️'
    case '09':
      return '🌦'
    case '10':
      return '🌧'
    case '11':
      return '🌩'
    case '13':
      return '❄️'
    case '50':
      return '🌫'
    default:
      break
  }
}
