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
      lc.sendMessage(`:new: [\`${getHours()}:${getMinutes()}\`] User \`${res.perpetrator.username}#${res.perpetrator.discriminator}\` created a ${res.type} channel: **${res.channelName}** (${res.channelID})`)
    }).catch(_ => {
      // No audit log access or something else; ignore
    })
  })
}

function channelUpdated (c, bot) {
  getChannel(c.channel.guild_id, bot).then((lc) => {
    getLastResult(bot, c.channel.guild_id).then((res) => {
      if (res.before === res.after) {} else {
        lc.sendMessage(`:gear: [\`${getHours()}:${getMinutes()}\`] User \`${res.perpetrator.username}#${res.perpetrator.discriminator}\` edited a ${res.type} channel's name: Before: **${res.before}** | After: **${res.after}**`)
      }
    })
  })
}

function channelDeleted (c, bot) {
  getChannel(c.data.guild_id, bot).then((lc) => {
    getLastResult(bot, c.data.guild_id).then((res) => {
      lc.sendMessage(`🚮 [\`${getHours()}:${getMinutes()}\`] User \`${res.perpetrator.username}#${res.perpetrator.discriminator}\` deleted a ${res.type} channel: **${res.channelName}** (${res.channelID})`)
    }).catch(_ => {
      // Ignore
    })
  })
}

export { channelCreated, channelUpdated, channelDeleted, getChannel }
