const Config = require('../config.json')
import { getLastResult } from '../databases/auditlogs'

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

import { getMinutes, getHours } from '../engine/timeutils'

function getChannel (guildID, bot) {
  return new Promise(function (resolve, reject) {
    r.db('Guilds').table('all').filter({
      'guildID': guildID
    }).run().then((lc) => {
      if (lc[0].logchannel === '' || lc[0].logchannel === undefined) {
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
      lc.sendMessage(`:new: [\`${getHours()}:${getMinutes()}\`] User **${res.perpetrator.username}#${res.perpetrator.discriminator}** created a ${c.channel.type === 2 ? 'voice' : 'text'} channel: *${c.channel.name}* (${c.channel.id})`)
    })
  })
}

function channelDeleted (c, bot) {
  getChannel(c.data.guild_id, bot).then((lc) => {
    getLastResult(bot, c.data.guild_id).then((res) => {
      lc.sendMessage(`:x: [\`${getHours()}:${getMinutes()}\`] User **${res.perpetrator.username}#${res.perpetrator.discriminator}** deleted a ${c.data.type === 2 ? 'voice' : 'text'} channel: *${c.data.name}* (${c.channelId})`) // needs better emojis
    })
  })
}

export { channelCreated, channelDeleted, getChannel }