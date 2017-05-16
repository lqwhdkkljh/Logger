import fs from 'fs'
import { logger } from '../engine/logger'
import { getMinutes, getHours } from '../engine/timeutils'
import { getChannel } from './channel'
import { getLastResult } from '../databases/auditlogs'

function messageUpdate (m, bot) {
  if (m.message === null || m.message.content === null) {
    // Omit
  } else if (m.message.author.id === bot.User.id) {
    // Omit
  } else {
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
}

function messageDelete (m, bot) {
  if (m.message === null) {
    // Omit
  } else {
    getChannel(m.message.guild.id, bot).then((lc) => {
      if (lc.id === m.message.channel.id) {
        // Ignore
      } else {
        getLastResult(bot, m.message.guild.id).then((res) => {
          lc.sendMessage(`❌ [\`${getHours()}:${getMinutes()}\`] User **${res.perpetrator.username}#${res.perpetrator.discriminator}** deleted *${m.message.member.username}#${m.message.member.discriminator}* (${m.message.member.id})'s message in <#${m.message.channel.id}>:\n${m.message.content}`)
        })
      }
    })
  }
}

function messageDeleteBulk (m, bot) {
  if (!m.messages) {
    // Omit
  } else if (m.messages.length <= 1) {
    // Not really a bulk delete with one message, so omit. Check below for explanations.
  } else {
    getChannel(m.messages[0].guild.id, bot).then((lc) => {
      if (lc.id === m.messages[0].channel_id) {
        // Ignore
      } else {
        let messageArray = m.messages.map((message) => {
          return message.content
        })
        getLastResult(bot, m.messages[0].guild.id).then((res) => {
          let osType = `${__dirname.substr(0, __dirname.length - 9)}upload/`
          fs.writeFile(`${osType}bulk_delete_messages.txt`, messageArray.join('\n'), (err) => {
            if (err) logger.error(err)
            lc.uploadFile('upload/bulk_delete_messages.txt', 'upload/bulk_delete_messages.txt', `❌ [\`${getHours()}:${getMinutes()}\`] Multiple messages were deleted from <#${m.messages[0].channel.id}> by **${res.perpetrator.username}#${res.perpetrator.discriminator}** (${res.perpetrator.id}):`).then(() => {
              fs.unlink('upload/bulk_delete_messages.txt', (err) => {
                if (err) logger.error(err)
              })
            })
          // Omit if nothing
          })
        }
        )
      }
    })
  }
}

/*
Note about the bulk message delete function: If you get an incomplete
.txt file or only one message, it's because the bot hasn't cached all
of the messages that were deleted.
*/

/*
Something that should be noted for all event handlers relating to messages:
There is an edge case where a message is deleted right after the bot is started
and it will hence not be cached. The bot might then error.

I believe this is a problem we just have to live with and cannot affect. Normally,
at least one message will have time to get cached and that is enough for the fetcher.
Regardless, this issue exists and should be noted.
*/

export { messageUpdate, messageDelete, messageDeleteBulk }
