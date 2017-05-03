import { logger } from '../engine/logger'
import { checkNick, checkRoleChanges } from '../engine/checks'

import { getChannel } from './channel'

function checkMemberUpdates (m, bot) {
  let data = {
    'color': 3404799,
    'timestamp': new Date(),
    'footer': {
      'icon_url': `${bot.User.avatarURL}`,
      'text': `${bot.User.username}#${bot.User.discriminator}`
    },
    'author': {
      'name': `${m.member.username}#${m.member.discriminator}`,
      'icon_url': `${m.member.avatarURL}`
    },
    'fields': []
  }
  getChannel(m.guild.id, bot).then((lc) => {
    let memberChanges = m.getChanges()
    let nickChange = checkNick(memberChanges, m.member, bot)
    let roleChange = checkRoleChanges(m.rolesAdded, m.rolesRemoved, m.member)
    if (nickChange) {
      data.fields.push(nickChange)
    }
    if (roleChange) {
      data.fields.push(roleChange)
    }
    lc.sendMessage(' ', false, data)
  }).catch(e => {
    logger.error(e)
  })
}

export { checkRoleChanges, checkMemberUpdates }
