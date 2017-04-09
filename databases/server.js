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

function guildJoin (m, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': m.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes <= 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()

    let data = {
      'title': `User joined`,
      'description': '\u200b',
      'timestamp': new Date(),
      'color': 2221329,
      'footer': { 'icon_url': `${bot.User.avatarURL}`, 'text': 'Logger' },
      'thumbnail': { 'url': `${m.member.avatarURL}` },
      'fields': [{
        'name': 'Name:',
        'value': `${m.member.username}#${m.member.discriminator}`
      },
      {
        'name': 'ID:',
        'value': `${m.member.id}`
      },
      {
        'name': 'Account created:',
        'value': `${m.member.createdAt}`
      }]
    }
    logChannel.sendMessage(`📥 [\`${getHours()}:${minutes}\`] User \`${m.member.username}#${m.member.discriminator}\` joined the server.`, false, data)
  })
}

function guildLeave (u, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': u.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes <= 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()

    let data = {
      'title': `User left or was kicked`,
      'description': '\u200b',
      'timestamp': new Date(),
      'color': 15789330,
      'footer': { 'icon_url': `${bot.User.avatarURL}`, 'text': 'Logger' },
      'thumbnail': { 'url': `${u.user.avatarURL}` },
      'fields': [{
        'name': 'Name:',
        'value': `${u.user.username}#${u.user.discriminator}`
      },
      {
        'name': 'ID:',
        'value': `${u.user.id}`
      }]
    }
    logChannel.sendMessage(`📤 [\`${getHours()}:${minutes}\`] User \`${u.user.username}#${u.user.discriminator}\` left or was kicked from the server.`)
  })
}

function guildBan (u, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': u.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes <= 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
    logChannel.sendMessage(`🚫 [\`${getHours()}:${minutes}\`] User \`${u.user.username}#${u.user.discriminator}\` was banned from the server.`)
  })
}

function guildUnban (u, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': u.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes <= 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
    logChannel.sendMessage(`🚨 [\`${getHours()}:${minutes}\`] User \`${u.user.username}#${u.user.discriminator}\` was unbanned from the server.`)
  })
}

export {
  guildJoin,
  guildLeave,
  guildBan,
  guildUnban
}
