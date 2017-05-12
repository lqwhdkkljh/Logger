const Config = require('../config.json')
const devRoleId = '304977386364076032' // LoggerDev

function checkIfDev (msg) {
  function checkIds (id) {
    let x = 0
    for (x = 0; x < Config.permissions.eval.length; x++) {
      if (id === Config.permissions.eval[x]) {
        return true
      } else {
        return false
      }
    }
  }
  let hasDevRole = msg.member.hasRole(devRoleId) || checkIds(msg.author.id)
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
