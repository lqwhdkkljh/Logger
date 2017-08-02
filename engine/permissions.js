const Config = require('../config.json')
const devRoleId = Config.ids.devRole

function checkIfDev (msg) {
  function checkIds (id) {
    if (Config.permissions.eval.indexOf(msg.author.id) !== 0) {
      return true
    } else {
      return false
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
  let userPerms = msg.author.permissionsFor(msg.channel)
  if (isDev) {
    return true
  } else if (msg.author.id === msg.guild.owner_id) {
    return true
  } else if (userPerms.General.ADMINISTRATOR || userPerms.general.MANAGE_SERVER) {
    return true
  } else {
    return false
  }
}

export { checkIfDev, checkIfAllowed }
