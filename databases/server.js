import { getMinutes, getHours } from '../engine/timeutils'
import { getChannel } from './channel'
import { getLastResult } from '../databases/auditlogs'

function getAccountDate (m) {
  let createdAt = new Date() - new Date(m.member.createdAt)
  if (createdAt > 604800000) {
    return ['2221329', 'Yes']
  } else {
    return ['16734003', 'No, be warned']
  }
}

function guildJoin (m, bot) {
  getChannel(m.member.guild_id, bot).then((lc) => {
    let sevenDayCheck = getAccountDate(m)
    let data = {
      'title': 'User joined',
      'timestamp': new Date(),
      'color': sevenDayCheck[0],
      'footer': { 'icon_url': `${bot.User.avatarURL}`, 'text': 'Logger' },
      'thumbnail': { 'url': `${m.member.avatarURL === null ? 'https://cdn0.iconfinder.com/data/icons/large-glossy-icons/512/No.png' : m.member.avatarURL}` },
      'fields': [{
        'name': 'Name:',
        'value': `${m.member.nickMention} (${m.member.username}#${m.member.discriminator})`
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
    lc.sendMessage(`📥 [\`${getHours()}:${getMinutes()}\`] User \`${m.member.username}#${m.member.discriminator}\` joined the server.`, false, data)
  })
}

function guildLeave (u, bot) {
  getChannel(u.data.guild_id, bot).then((lc) => {
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
    lc.sendMessage(`📤 [\`${getHours()}:${getMinutes()}\`] User \`${u.user.username}#${u.user.discriminator}\` left or was kicked from the server.`, false, data)
  })
}

function guildBan (u, bot) {
  getChannel(u.guild.id, bot).then((lc) => {
    getLastResult(bot, u.guild.id).then((res) => {
      lc.sendMessage(`🔨 [\`${getHours()}:${getMinutes()}\`] User **${res.perpetrator.username}#${res.perpetrator.discriminator}** banned *${u.user.username}#${u.user.discriminator}* (${res.target.id}) from the server for \`${res.reason}\`.`)
    })
  })
}

function guildUnban (u, bot) {
  getChannel(u.guild.id, bot).then((lc) => {
    getLastResult(bot, u.guild.id).then((res) => {
      lc.sendMessage(`🚨 [\`${getHours()}:${getMinutes()}\`] User *${u.user.username}#${u.user.discriminator}* was unbanned from the server by **${res.perpetrator.username}#${res.perpetrator.discriminator}**.`)
    })
  })
}

function guildEmojiUpdate (e, bot) {
  getChannel(e.guild.id, bot).then((lc) => {
    getLastResult(bot, e.guild.id).then((res) => {
      let emojiChanges = e.getChanges()
      let after = emojiChanges.after
      let before = emojiChanges.before
      if (before.length > after.length) {
        lc.sendMessage(`:frowning: [\`${getHours()}:${getMinutes()}\`] **${res.perpetrator.username}#${res.perpetrator.discriminator}** removed emoji: *${before[before.length - 1].name}* (${before[before.length - 1].id})`)
      } else {
        lc.sendMessage(`:smiley: [\`${getHours()}:${getMinutes()}\`] **${res.perpetrator.username}#${res.perpetrator.discriminator}** added an emoji: <:${after[after.length - 1].name}:${after[after.length - 1].id}> *${after[after.length - 1].name}* (${after[after.length - 1].id})`)
      }
    })
  })
}

export { guildJoin, guildLeave, guildBan, guildUnban, guildEmojiUpdate }
