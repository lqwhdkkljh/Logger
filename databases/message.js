import { logger } from '../engine/logger'
import { getMinutes, getHours } from '../engine/timeutils'
import { getChannel } from './channel'
import { generatePaste } from '../engine/paste'

function messageUpdate (m, bot) {
  if (m.message === null) {
    return
    /* If the message isn't cached, do nothing. There is the data object (m.data),
    but it doesn't show edits, defeating the purpose of this function. */
  }
  if (m.message.author.id === bot.User.id) {
    return // Ignore edits on messages the bot itself posts
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
  if (m.message.content === null) {
    return
  }
  getChannel(m.message.guild.id, bot).then((lc) => {
    if (lc.id === m.message.channel.id) { // Ignore
    } else {
      lc.sendMessage(`❌ [\`${getHours()}:${getMinutes()}\`] User \`${m.message.member.username}#${m.message.member.discriminator}\` deleted their message in *${m.message.channel.name}*:\n${m.message.content}`)
    }
  })
}

function messageDeleteBulk (m, bot) {
  if (m.messages === null) { // Ignore
  }
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

export { messageUpdate, messageDelete, messageDeleteBulk }
