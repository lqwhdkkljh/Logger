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

let minutes = getMinutes()
minutes < 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
let hours = getHours()
hours < 10 ? hours = `0${getHours()}` : hours = getHours()

function messageUpdate (m, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': m.message.guild.id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let current = m.message.content
    let edits = m.message.edits
    let before = edits[edits.length - 1].content
    if (current === before) {
      return
    }
    logChannel.sendMessage(`❗ [\`${hours}:${minutes}\`] User \`${m.message.member.username}#${m.message.member.discriminator}\` edited their message in *${m.message.channel.name}*:\nBefore: ${before}\nAfter: ${current}`)
  })
}

function messageDelete (m, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': m.message.guild.id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    logChannel.sendMessage(`❌ [\`${hours}:${minutes}\`] User \`${m.message.member.username}#${m.message.member.discriminator}\` deleted their message in *${m.message.channel.name}*:\n${m.message.content}`)
  })
}

export { messageUpdate, messageDelete }
