const Config = require('../config.json')
import * as request from 'superagent'

function getLastResult (bot, guildID) {
  return new Promise(function (resolve, reject) {
    request
    .get(`https://discordapp.com/api/guilds/${guildID}/audit-logs`)
    .set(`Authorization`, `Bot ${Config.core.token}`)
    .end(function (err, resp) {
      if (err && err.status === 403) {
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
        if (lastEntry.action_type === 22 || lastEntry.action_type === 20) {
          resolve({'perpetrator': perpetrator, 'target': target, 'reason': `${lastEntry.reason ? lastEntry.reason : 'no reason provided'}`})
        } else {
          resolve({'perpetrator': perpetrator, 'target': target})
        }
      }
    })
  })
}

export { getLastResult }
