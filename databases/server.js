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

function getAccountDate (m) {
  let createdAt = new Date() - new Date(m.member.createdAt)
  if (createdAt > 604800000) {
    return ['2221329', 'Yes']
  } else {
    return ['16734003', 'No, be warned']
  }
}

function guildJoin (m, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': m.member.guild_id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes < 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
    let hours = getHours()
    hours < 10 ? hours = `0${getHours()}` : hours = getHours()
    let sevenDayCheck = getAccountDate(m)
    let data = {
      'title': `User joined`,
      'timestamp': new Date(),
      'color': sevenDayCheck[0],
      'footer': { 'icon_url': `${bot.User.avatarURL}`, 'text': 'Logger' },
      'thumbnail': { 'url': `${bot.User.avatarURL}` },
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
      },
      {
        'name': 'Older than 7 days?',
        'value': sevenDayCheck[1]
      }
      ]
    }
    logChannel.sendMessage(`📥 [\`${hours}:${minutes}\`] User \`${m.member.username}#${m.member.discriminator}\` joined the server.`, false, data)
  })
}

function guildLeave (u, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': u.data.guild_id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes < 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
    let hours = getHours()
    hours < 10 ? hours = `0${getHours()}` : hours = getHours()

    let data = {
        'title': `User left or was kicked`,
        'timestamp': new Date(),
        'color': 15789330,
        'footer': { 'icon_url': `${bot.User.avatarURL}`, 'text': 'Logger' },
        'thumbnail': { 'url': `${u.user.avatarURL ? u.user.avatarURL : 'https://cdn0.iconfinder.com/data/icons/large-glossy-icons/512/No.png'}` },
        'fields': [{
          'name': 'Name:',
          'value': `${u.user.username}#${u.user.discriminator}`
        },
        {
          'name': 'ID:',
          'value': `${u.user.id}`
        },
        {
          'name': 'Account created:',
          'value': `${u.user.registeredAt}`
        }]
    }
    logChannel.sendMessage(`📤 [\`${hours}:${minutes}\`] User \`${u.user.username}#${u.user.discriminator}\` left or was kicked from the server.`, false, data)
  })
}

function guildBan (u, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': u.guild.id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes < 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
    let hours = getHours()
    hours < 10 ? hours = `0${getHours()}` : hours = getHours()
    logChannel.sendMessage(`🔨 [\`${hours}:${minutes}\`] User \`${u.user.username}#${u.user.discriminator}\` was banned from the server.`)
  })
}

function guildUnban (u, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': u.guild.id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let minutes = getMinutes()
    minutes < 10 ? minutes = `0${getMinutes()}` : minutes = getMinutes()
    let hours = getHours()
    hours < 10 ? hours = `0${getHours()}` : hours = getHours()
    logChannel.sendMessage(`🚨 [\`${hours}:${minutes}\`] User \`${u.user.username}#${u.user.discriminator}\` was unbanned from the server.`)
  })
}

export {
  guildJoin,
  guildLeave,
  guildBan,
  guildUnban
}
