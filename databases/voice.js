import { getMinutes, getHours } from '../engine/timeutils'
import { getChannel } from './channel'

function voiceJoin (v, bot) {
  getChannel(v.guildId, bot).then((lc) => {
    lc.sendMessage(`📞 [\`${getHours()}:${getMinutes()}\`] User \`${v.user.username}#${v.user.discriminator}\` has joined voice channel **${v.channel.name}**.`)
  })
}

function voiceLeave (v, bot) {
  getChannel(v.guildId, bot).then((lc) => {
    if (!v.newChannelId) {
      lc.sendMessage(`📞 [\`${getHours()}:${getMinutes()}\`] User \`${v.user.username}#${v.user.discriminator}\` has left voice channel **${v.channel.name}**.`)
    } else {
      let newVoiceChannel = bot.Channels.get(`${v.newChannelId}`)
      lc.sendMessage(`📞 [\`${getHours()}:${getMinutes()}\`] User \`${v.user.username}#${v.user.discriminator}\` has changed voice channels from **${v.channel.name}** to **${newVoiceChannel.name}**.`)
    }
  })
}

export { voiceJoin, voiceLeave }
