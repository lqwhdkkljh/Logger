import { getLastResult } from '../databases/auditlogs'
import { getMinutes, getHours } from '../engine/timeutils'

const Config = require('../config.json')
const Dash = require('rethinkdbdash')
let r = new Dash({
  user: Config.database.user,
  password: Config.database.pass,
  silent: true,
  servers: [{
    host: Config.database.host,
    port: Config.database.port
  }]
})

function getChannel (guildID, bot) {
  return new Promise(function (resolve, reject) {
    r.db('Guilds').table('all').filter({
      'guildID': guildID
    }).run().then((lc) => {
      if (lc[0].logchannel === '' || lc[0].logchannel === undefined || !lc) {
        // Ignore no logchannel responses
      } else {
        let logChannel = bot.Channels.get(lc[0].logchannel)
        resolve(logChannel)
      }
    }).catch(e => {
      reject(e)
    })
  })
}

function channelCreated (c, bot) {
  getChannel(c.channel.guild_id, bot).then((lc) => {
    getLastResult(bot, c.channel.guild_id).then((res) => {
      lc.sendMessage(`:new: [\`${getHours()}:${getMinutes()}\`] User \`${res.perpetrator.username}#${res.perpetrator.discriminator}\` created a ${c.channel.type === 2 ? 'voice' : 'text'} channel: **${c.channel.name}** (${c.channel.id})`)
    }).catch(_ => {
      // No audit log access or something else; ignore
    })
  })
}

function channelDeleted (c, bot) {
  getChannel(c.data.guild_id, bot).then((lc) => {
    getLastResult(bot, c.data.guild_id).then((res) => {
      lc.sendMessage(`🚮 [\`${getHours()}:${getMinutes()}\`] User \`${res.perpetrator.username}#${res.perpetrator.discriminator}\` deleted a ${c.data.type === 2 ? 'voice' : 'text'} channel: **${c.data.name}** (${c.channelId})`)
    }).catch(_ => {
      // Ignore
    })
  })
}

export { channelCreated, channelDeleted, getChannel }
