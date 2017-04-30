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
  if (isDev === true) {
    return true
  } else if (msg.member.isOwner === true) {
    return true
  } else {
    return false
  }
}

export { checkIfDev, checkIfAllowed }
