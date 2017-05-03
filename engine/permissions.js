const devRoleId = '304977386364076032' // LoggerDev

function checkIfDev (msg) {
  let hasDevRole = msg.member.hasRole(devRoleId)
  if (hasDevRole) {
    return true
  } else {
    return false
  }
}

function checkIfAllowed (msg) {
  let isDev = checkIfDev(msg)
  if (isDev) {
    return true
  } else if (msg.author.id === msg.guild.owner_id) {
    return true
  } else {
    return false
  }
}

export { checkIfDev, checkIfAllowed }
