import { getLastResult } from '../databases/auditlogs'

function checkNick (changes, member, bot) {
  return new Promise(function (resolve, reject) {
    getLastResult(bot, member.guild.id).then((res) => {
      if (changes.before.nick !== changes.after.nick) {
        resolve({
          'name': 'Nick change',
          'value': `User ${res.perpetrator.mention} changed the nickname of *${res.target.username}* to ${res.target.nickMention}!`
        })
      } else {
        resolve(null) // yes, this will be resolve instead of reject until we find a better way to deal with this problem
      }
    }).catch(_ => {
      // Ignore
    })
  })
}

function checkRoleChanges (bot, rolesAdded, rolesRemoved, member) {
  return new Promise(function (resolve, reject) {
    getLastResult(bot, member.guild.id).then((res) => {
      if (rolesAdded.length > 0) {
        resolve({
          'name': 'Role change',
          'value': `User ${res.target.nickMention} was given role **${rolesAdded[0].name}** by ${res.perpetrator.nickMention}. `
        })
      } else if (rolesRemoved.length > 0) {
        resolve({
          'name': 'Role change',
          'value': `Role **${rolesRemoved[0].name}** was revoked from user ${res.target.nickMention} by ${res.perpetrator.nickMention}.`
        })
      } else {
        resolve(null)
      }
    }).catch(_ => {
      // Ignore
    })
  })
}

export { checkNick, checkRoleChanges }
