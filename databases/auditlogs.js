import * as request from 'superagent'

const Config = require('../config.json')

function getLastResult (bot, guildID) {
  return new Promise(function (resolve, reject) {
    request
    .get(`https://discordapp.com/api/guilds/${guildID}/audit-logs`)
    .set(`Authorization`, `Bot ${Config.core.token}`)
    .end(function (err, resp) {
      if (err && err.status === 50001) {
        bot.Guilds.get(guildID).owner.openDM().then((dm) => {
          dm.sendMessage('Hey there, seems like I don\'t have permissions to view audit logs on your server. I need that to operate fully, please allow that for my role!')
        }).catch((e) => {
          // ignore
        })
        reject(err)
      } else {
        let lastEntry = resp.body.audit_log_entries[0]
        let target = bot.Users.get(lastEntry.target_id)
        let perpetrator = bot.Users.get(lastEntry.user_id)
        switch (lastEntry.action_type) {
          case 10: // channel created
            if (lastEntry.changes[lastEntry.changes.length - 2].new_value === 0) {
              resolve({'perpetrator': perpetrator, 'type': 'text', 'channelName': lastEntry.changes[2].new_value, 'channelID': lastEntry.id})
            } else {
              resolve({'perpetrator': perpetrator, 'type': 'voice', 'channelName': lastEntry.changes[3].new_value, 'channelID': lastEntry.id})
            }
            break
          case 11: // channel updated (only name)
            resolve({'perpetrator': perpetrator, 'type': bot.Channels.get(lastEntry.target_id).type === 0 ? 'text' : 'voice', 'before': lastEntry.changes[0].old_value, 'after': lastEntry.changes[0].new_value})
            break
          case 12: // channel deleted
            if (lastEntry.changes[lastEntry.changes.length - 2].old_value === 0) {
              resolve({'perpetrator': perpetrator, 'type': 'text', 'channelName': lastEntry.changes[2].old_value, 'channelID': lastEntry.id})
            } else {
              resolve({'perpetrator': perpetrator, 'type': 'voice', 'channelName': lastEntry.changes[3].old_value, 'channelID': lastEntry.id})
            }
            break
          case 20: // kick
          case 22: // ban
            resolve({'perpetrator': perpetrator, 'target': target, 'reason': `${lastEntry.reason ? lastEntry.reason : 'no reason provided'}`}) // future proofing for when we add kick and ban reasons again.
            break
          case 25: // role added to user
            resolve({'perpetrator': perpetrator, 'target': target, 'roleName': lastEntry.changes[0].new_value[0].name})
            break
          case 32: // role deleted
            resolve({'perpetrator': perpetrator, 'target': target, 'roleName': lastEntry.changes[lastEntry.changes.length - 2].old_value})
            break
          case 40: // invite created
            resolve({'perpetrator': perpetrator, 'max_minutes': lastEntry.changes[0].new_value / 60, 'code': lastEntry.changes[1].new_value, 'temporary': lastEntry.changes[2].new_value, 'creator': bot.Users.get(lastEntry.changes[3].new_value), 'channel': bot.Channels.get(lastEntry.changes[4].new_value), 'max_uses': lastEntry.changes[6].new_value})
            break // more future proofing
          case 42: // invite removed
            resolve({'perpetrator': perpetrator, 'max_minutes': lastEntry.changes[0].new_value / 60, 'code': lastEntry.changes[1].new_value, 'temporary': lastEntry.changes[2].new_value, 'creator': bot.Users.get(lastEntry.changes[3].new_value), 'channel': bot.Channels.get(lastEntry.changes[4].new_value), 'uses': lastEntry.changes[5].new_value, 'max_uses': lastEntry.changes[6].new_value})
            break
          case 60: // emoji added
            resolve({'perpetrator': perpetrator, 'emojiName': lastEntry.changes[0].new_value})
            break
          case 61: // emoji updated
            resolve({'perpetrator': perpetrator, 'before': lastEntry.changes[0].old_value, 'after': lastEntry.changes[0].new_value})
            break
          case 62: // emoji removed
            resolve({'perpetrator': perpetrator, 'emojiName': lastEntry.changes[0].old_value})
            break
        }
      }
    })
  })
}

export { getLastResult }
