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
        try {
          var lastEntry = resp.body.audit_log_entries[0]
        } catch (err) {
          resolve(false)
        }
        let target = bot.Users.get(lastEntry.target_id)
        let perpetrator = bot.Users.get(lastEntry.user_id)

          // For a glossary of action types, see below
        switch (lastEntry.action_type) {
          case 10:
            if (lastEntry.changes[lastEntry.changes.length - 2].new_value === 0) {
              resolve({'perpetrator': perpetrator, 'type': 'text', 'channelName': lastEntry.changes[2].new_value, 'channelID': lastEntry.id})
            } else {
              resolve({'perpetrator': perpetrator, 'type': 'voice', 'channelName': lastEntry.changes[3].new_value, 'channelID': lastEntry.id})
            }
            break
          case 11:
            resolve({'perpetrator': perpetrator, 'type': bot.Channels.get(lastEntry.target_id).type === 0 ? 'text' : 'voice', 'before': lastEntry.changes[0].old_value, 'after': lastEntry.changes[0].new_value})
            break
          case 12:
            if (lastEntry.changes[lastEntry.changes.length - 2].old_value === 0) {
              resolve({'perpetrator': perpetrator, 'type': 'text', 'channelName': lastEntry.changes[2].old_value, 'channelID': lastEntry.id})
            } else {
              resolve({'perpetrator': perpetrator, 'type': 'voice', 'channelName': lastEntry.changes[3].old_value, 'channelID': lastEntry.id})
            }
            break
          case 20:
          case 22:
            resolve({'perpetrator': perpetrator, 'target': target, 'reason': `${lastEntry.reason ? lastEntry.reason : 'no reason provided'}`}) // future proofing for when we add kick and ban reasons again.
            break
          case 25:
            resolve({'perpetrator': perpetrator, 'target': target, 'roleName': lastEntry.changes[0].new_value[0].name})
            break
          case 32:
            resolve({'perpetrator': perpetrator, 'target': target, 'roleName': lastEntry.changes[lastEntry.changes.length - 2].old_value})
            break
          case 40:
            resolve({'perpetrator': perpetrator, 'max_minutes': lastEntry.changes[0].new_value / 60, 'code': lastEntry.changes[1].new_value, 'temporary': lastEntry.changes[2].new_value, 'creator': bot.Users.get(lastEntry.changes[3].new_value), 'channel': bot.Channels.get(lastEntry.changes[4].new_value), 'max_uses': lastEntry.changes[6].new_value})
            break // more future proofing
          case 42:
            resolve({'perpetrator': perpetrator, 'max_minutes': lastEntry.changes[0].new_value / 60, 'code': lastEntry.changes[1].new_value, 'temporary': lastEntry.changes[2].new_value, 'creator': bot.Users.get(lastEntry.changes[3].new_value), 'channel': bot.Channels.get(lastEntry.changes[4].new_value), 'uses': lastEntry.changes[5].new_value, 'max_uses': lastEntry.changes[6].new_value})
            break
          case 60:
            resolve({'perpetrator': perpetrator, 'emojiName': lastEntry.changes[0].new_value})
            break
          case 61:
            resolve({'perpetrator': perpetrator, 'before': lastEntry.changes[0].old_value, 'after': lastEntry.changes[0].new_value})
            break
          case 62:
            resolve({'perpetrator': perpetrator, 'emojiName': lastEntry.changes[0].old_value})
            break
        }
      }
    })
  })
}

/*
TYPE NUMBER GLOSSARY

10: Channel created
11: Channel name updated
12: Channel deleted

20: Kick
22: Ban

25: Role added to user
32: Role deleted

40: Invite created
42: Invite removed

60: Emoji added
61: Emoji updated
62: Emoji removed
*/

export { getLastResult }
