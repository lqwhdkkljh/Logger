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

import {
  getMinutes,
  getHours
} from '../engine/timeutils'

let minutes = getMinutes()
minutes < 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
let hours = getHours()
hours < 10 ? hours = `0${getHours()}` : hours = getHours()

function channelCreated (c, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': c.channel.guild_id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    logChannel.sendMessage(`:new: [\`${hours}:${minutes}\`] ${c.channel.type === 2 ? 'Voice' : 'Text'} channel created: *${c.channel.name}* (${c.channel.id})`)
  })
}

function channelDeleted (c, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': c.data.guild_id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    logChannel.sendMessage(`:new: [\`${hours}:${minutes}\`] ${c.data.type === 2 ? 'Voice' : 'Text'} channel deleted: *${c.data.name}* (${c.channelId})`) // needs better emojis
  })
}

export {
    channelCreated,
    channelDeleted
}
