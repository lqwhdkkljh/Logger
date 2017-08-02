import { getLastResult } from '../databases/auditlogs'

function checkNick (changes, member, bot) {
  return new Promise(function (resolve, reject) {
    getLastResult(bot, member.guild.id).then((res) => {
      if (res === false) {
        // Do nothing
      } else {
        if (changes.before.nick !== changes.after.nick) {
          resolve({
            'name': 'Nick change',
            'value': `User ${res.perpetrator.mention} changed the nickname of *${res.target.username}* to ${res.target.nickMention}!`
          })
        } else {
          resolve(null) // yes, this will be resolve instead of reject until we find a better way to deal with this problem
        }
      }
    }).catch(_ => {
      // Ignore
    })
  })
}

function checkRoleChanges (bot, rolesAdded, rolesRemoved, member) {
  return new Promise(function (resolve, reject) {
    getLastResult(bot, member.guild.id).then((res) => {
      if (res === false) {
        // Do nothing
      } else {
        if (rolesAdded.length > 0) {
          resolve({
            'name': 'Role change',
            'value': `User ${res.target.nickMention} (${res.target.username}) was given role **${rolesAdded[0].name}** by ${res.perpetrator.nickMention} (${res.perpretrator.username}).`
          })
        } else if (rolesRemoved.length > 0) {
          resolve({
            'name': 'Role change',
            'value': `Role **${rolesRemoved[0].name}** was revoked from user ${res.target.nickMention} (${res.target.username}) by ${res.perpetrator.nickMention} (${res.perpetrator.username}).`
          })
        } else {
          resolve(null)
        }
      }
    }).catch(_ => {
      // Ignore
    })
  })
}

export { checkNick, checkRoleChanges }
