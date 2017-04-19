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

function userRoleAdded (g, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': g.guild.id
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    const data = {
      'color': 3404799,
      'timestamp': new Date(),
      'footer': {
        'icon_url': `${bot.User.avatarURL}`,
        'text': `${bot.User.username}#${bot.User.discriminator}`
      },
      'author': {
        'name': `${g.member.username}#${g.member.discriminator}`,
        'icon_url': `${g.member.avatarURL}`
      },
      'fields': [{
        'name': `${g.rolesAdded.length === 0 ? 'Roles removed:' : 'Roles added:'}`,
        'value': g.rolesAdded.length !== 0 ? `${g.member.username}#${g.member.discriminator} (${g.member.id}) was given role *${g.rolesAdded[0].name}*.` : `Role *${g.rolesRemoved[0].name}* was revoked from ${g.member.username}#${g.member.discriminator} (${g.member.id}).`
      }]
    }
    logChannel.sendMessage('\u200b', false, data) // you need message content.
  })
}
export {
  userRoleAdded
}
