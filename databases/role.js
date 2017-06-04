import { getLastResult } from './auditlogs'
import { getChannel } from './channel'
import { checkNick, checkRoleChanges } from '../engine/checks'
import { getMinutes, getHours } from '../engine/timeutils'

function checkMemberUpdates (m, bot) {
  let data = {
    'color': 3404799,
    'timestamp': new Date(),
    'footer': {
      'icon_url': `${bot.User.avatarURL === null ? 'https://cdn0.iconfinder.com/data/icons/large-glossy-icons/512/No.png' : bot.User.avatarURL}`,
      'text': `${bot.User.username}#${bot.User.discriminator}`
    },
    'author': {
      'name': `${m.member.username}#${m.member.discriminator}`,
      'icon_url': `${m.member.avatarURL === null ? 'https://cdn0.iconfinder.com/data/icons/large-glossy-icons/512/No.png' : m.member.avatarURL}`
    },
    'fields': []
  }
  getChannel(m.guild.id, bot).then((lc) => {
    let memberChanges = m.getChanges()
    checkNick(memberChanges, m.member, bot).then((nickChange) => {
      if (nickChange) {
        data.fields.push(nickChange)
        lc.sendMessage(' ', false, data)
      } else {
        // ignore
      }
    })
    checkRoleChanges(bot, m.rolesAdded, m.rolesRemoved, m.member).then((roleChanges) => {
      if (roleChanges) {
        data.fields.push(roleChanges)
        lc.sendMessage(' ', false, data)
      } else {
        // ignore
      }
    })
  })
}

function guildRoleDeleted (g, bot) {
  console.log('recieved')
  getChannel(g.guild.id, bot).then((lc) => {
    console.log('got the channel')
    getLastResult(bot, g.guild.id).then((res) => {
      console.log('also got last result? wtf')
      console.log(`:put_litter_in_its_place: [\`${getHours()}:${getMinutes()}\`] User \`${res.perpetrator.username}#${res.perpetrator.discriminator}\` has deleted role ${res.roleName}`)
      lc.sendMessage(`:put_litter_in_its_place: [\`${getHours()}:${getMinutes()}\`] User \`${res.perpetrator.username}#${res.perpetrator.discriminator}\` has deleted role **${res.roleName}**`)
    })
  })
}

export { checkRoleChanges, checkMemberUpdates, guildRoleDeleted }
