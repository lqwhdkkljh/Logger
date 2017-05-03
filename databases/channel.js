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

import { getMinutes, getHours } from '../engine/timeutils'

function getChannel (guildID, bot) {
  return new Promise(function (resolve, reject) {
    r.db('Guilds').table('all').filter({
      'guildID': guildID
    }).run().then((lc) => {
      let logChannel = bot.Channels.get(lc[0].logchannel)
      resolve(logChannel)
    }).catch(e => {
      reject(e)
    })
  })
}

function channelCreated (c, bot) {
  getChannel(c.channel.guild_id, bot).then((lc) => {
    lc.sendMessage(`:new: [\`${getHours()}:${getMinutes()}\`] ${c.channel.type === 2 ? 'Voice' : 'Text'} channel created: *${c.channel.name}* (${c.channel.id})`)
  })
}

function channelDeleted (c, bot) {
  getChannel(c.data.guild_id, bot).then((lc) => {
    lc.sendMessage(`:x: [\`${getHours()}:${getMinutes()}\`] ${c.data.type === 2 ? 'Voice' : 'Text'} channel deleted: *${c.data.name}* (${c.channelId})`) // needs better emojis
  })
}

export { channelCreated, channelDeleted, getChannel }
