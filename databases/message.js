import { logger } from '../engine/logger'
import { getMinutes, getHours } from '../engine/timeutils'
import { getChannel } from './channel'
import { generatePaste } from '../engine/paste'

function messageUpdate (m, bot) {
  if (m.message === null || m.message.content === null) {
  } // Omit
  if (m.message.author.id === bot.User.id) {
    return
  }
  getChannel(m.message.guild.id, bot).then((lc) => {
    let current = m.message.content
    let edits = m.message.edits
    let before = edits[edits.length - 1].content
    if (current === before) {
      return
    }
    lc.sendMessage(`❗ [\`${getHours()}:${getMinutes()}\`] User \`${m.message.member.username}#${m.message.member.discriminator}\` edited their message in *${m.message.channel.name}*:\nBefore: ${before}\nAfter: ${current}`)
  }).catch(e => {
    logger.error(e)
  })
}

function messageDelete (m, bot) {
  if (m.message === null) {
  } // Omit
  getChannel(m.message.guild.id, bot).then((lc) => {
    if (lc.id === m.message.channel.id) { // Ignore
    } else {
      lc.sendMessage(`❌ [\`${getHours()}:${getMinutes()}\`] User \`${m.message.member.username}#${m.message.member.discriminator}\` deleted their message in *${m.message.channel.name}*:\n${m.message.content}`)
    }
  })
}

function messageDeleteBulk (m, bot) {
  if (m.messages === null) {
  } // Omit
  getChannel(m.messages[0].guild.id, bot).then((lc) => {
    if (lc.id === m.messages[0].channel_id) { // Ignore
    } else {
      let messageArray = m.messages.map((message) => {
        return message.content
      })
      lc.sendMessage(`❌ [\`${getHours()}:${getMinutes()}\`] Multiple messages were deleted from *${m.messages[0].channel.name}*:`)
      generatePaste(lc, messageArray.join('\n'))
    }
  })
}

/*
Something that should be noted for all event handlers relating to messages:
There is an edge case where a message is deleted right after the bot is started
and it will hence not be cached. The bot might then error.

I believe this is a problem we just have to live with and cannot affect. Normally,
at least one message will have time to get cached and that is enough for the fetcher.
Regardless, this issue exists and should be noted.
*/

export { messageUpdate, messageDelete, messageDeleteBulk }
