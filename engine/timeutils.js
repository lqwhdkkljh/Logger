const date = new Date()

function getMinutes () {
  let minutes = date.getMinutes()
  return minutes
}

function getHours () {
  let hours = date.getHours()
  return hours
}

function getDay () {
  let days = date.getDays()
  return days
}

function getYear () {
  let years = date.getFullYear()
  return years
}

export {
  getMinutes,
  getHours,
  getDay,
  getYear
}
