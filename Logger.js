import Discordie from 'discordie'
const bot = new Discordie({ autoReconnect: true })
export { bot }

const Config = require('./config.json')
import { logger } from './engine/logger'
import { Commands } from './engine/commands'
import { channelCreated, channelDeleted } from './databases/channel'
import { guildCreate, guildDelete, pingDatabase } from './databases/guild'
import { messageUpdate, messageDelete, messageDeleteBulk } from './databases/message'
import { checkMemberUpdates } from './databases/role'
import { guildJoin, guildLeave, guildBan, guildUnban, guildEmojiUpdate } from './databases/server'
import { voiceJoin, voiceLeave } from './databases/voice'

process.title = 'Logger'

try {
  bot.connect({ token: Config.core.token })
} catch (err) {
  logger.error(`Error while logging in, invalid credentials? Error:\n${err}`)
  process.exit()
}

bot.Dispatcher.on('GATEWAY_READY', x => {
  logger.info(`Successfully logged in!\nUser: ${bot.User.username}\nID: ${bot.User.id}`)
  pingDatabase() // Verify RethinkDB is running
  bot.User.setStatus('online', Config.core.defaultstatus)
})

bot.Dispatcher.on('MESSAGE_CREATE', y => {
  if (y.message.author.bot || y.message.author.id === bot.User.id) {
    // Ignore
  } else {
    if (y.message.isPrivate) {
      y.message.reply('This bot cannot be used in direct messages. Please invite me to a server and try again!')
    } else {
      let prefix = Config.core.prefix
      if (y.message.content.startsWith(prefix)) {
        let cmdObj = y.message.content.substring(prefix.length).split(' ')[0].toLowerCase()
        let keys = Object.keys(Commands)
        let splitSuffix = y.message.content.substr(Config.core.prefix.length).split(' ')
        let suffix = splitSuffix.slice(1, splitSuffix.length).join(' ')

        if (keys.includes(cmdObj)) {
          try {
            let botPerms = bot.User.permissionsFor(y.message.channel)
            if (!botPerms.Text.READ_MESSAGES || !botPerms.Text.SEND_MESSAGES) {
              // Ignore
            } else {
              if (cmdObj === 'help' && !suffix) {
                var cmdArray = []
                for (let prop in Commands) {
                  if (!Commands[prop].hasOwnProperty('hidden') && Commands[prop].hidden !== true) {
                    cmdArray.push(`\`${Config.core.prefix}${Commands[prop].name}\` - ${Commands[prop].info}`)
                  }
                }
                y.message.channel.sendMessage(`**Command list for Logger:**\n \n${cmdArray.join('\n')}\n \nPlease note that all commands may not be usable for you. Use \`%help <command>\` for more info.`)
              } else {
                logger.debug(`Executing command "${cmdObj}" from user ${y.message.author.name} (Server ID: ${y.message.guild.id})`)
                Commands[cmdObj].func(y.message, suffix, bot)
              }
            }
          } catch (err) {
            logger.error(`An error occurred while executing command '${cmdObj}', error returned:\n${err}`)
          }
        }
      }
    }
  }
})

bot.Dispatcher.on('CHANNEL_CREATE', (c) => {
  channelCreated(c, bot)
})

bot.Dispatcher.on('CHANNEL_DELETE', (c) => {
  channelDeleted(c, bot)
})

bot.Dispatcher.on('GUILD_CREATE', (g) => {
  guildCreate(g, bot)
})

bot.Dispatcher.on('GUILD_DELETE', (g) => {
  guildDelete(g)
})

bot.Dispatcher.on('VOICE_CHANNEL_JOIN', (v) => {
  voiceJoin(v, bot)
})

bot.Dispatcher.on('VOICE_CHANNEL_LEAVE', (v) => {
  voiceLeave(v, bot)
})

bot.Dispatcher.on('GUILD_EMOJIS_UPDATE', (e) => {
  guildEmojiUpdate(e, bot)
})

bot.Dispatcher.on('GUILD_MEMBER_ADD', (m) => {
  guildJoin(m, bot)
})

bot.Dispatcher.on('GUILD_MEMBER_REMOVE', (u) => {
  guildLeave(u, bot)
})

bot.Dispatcher.on('GUILD_MEMBER_UPDATE', (g) => {
  checkMemberUpdates(g, bot)
})

bot.Dispatcher.on('GUILD_BAN_ADD', (u) => {
  guildBan(u, bot)
})

bot.Dispatcher.on('GUILD_BAN_REMOVE', (u) => {
  guildUnban(u, bot)
})

bot.Dispatcher.on('MESSAGE_UPDATE', (m) => {
  messageUpdate(m, bot)
})

bot.Dispatcher.on('MESSAGE_DELETE', (m) => {
  messageDelete(m, bot)
})

bot.Dispatcher.on('MESSAGE_DELETE_BULK', (m) => {
  messageDeleteBulk(m, bot)
})
