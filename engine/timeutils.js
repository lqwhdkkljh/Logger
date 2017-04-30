function getMinutes () {
  let minutes = new Date().getMinutes()
  if (minutes <= 9) {
    minutes = `0${minutes}`
    return minutes
  }
  return minutes
}

function getHours () {
  let hours = new Date().getHours()
  if (hours <= 9) {
    hours = `0${hours}`
    return hours
  }
  return hours
}

function getDay () {
  let days = new Date().getDays()
  return days
}

function getYear () {
  let years = new Date().getFullYear()
  return years
}

export {
  getMinutes,
  getHours,
  getDay,
  getYear
}
