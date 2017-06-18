import Discordie from 'discordie'
import { logger } from './engine/logger'
import { Commands } from './engine/commands'
import { channelCreated, channelUpdated, channelDeleted } from './databases/channel'
import { guildCreate, guildDelete, pingDatabase } from './databases/guild'
import { messageUpdate, messageDelete, messageDeleteBulk } from './databases/message'
import { checkMemberUpdates, guildRoleDeleted } from './databases/role'
import { guildJoin, guildLeave, guildBan, guildUnban, guildEmojiUpdate } from './databases/server'
import { postStats } from './engine/stats'

const Config = require('./config.json')
const bot = new Discordie({ autoReconnect: true })
export { bot }

process.title = 'Logger'

bot.connect({ token: Config.core.token })

bot.Dispatcher.on('REQUEST_AUTH_LOGIN_ERROR', err => {
  logger.error(`An error occurred while logging in, invalid credentials? Exiting...\n${err}`)
  process.exit()
})

bot.Dispatcher.on('GATEWAY_READY', _ => {
  logger.info(`Successfully logged in!\nUser: ${bot.User.username}\nID: ${bot.User.id}`)
  pingDatabase() // Verify RethinkDB is running
  bot.User.setStatus('online', Config.core.defaultstatus)
  if (Config.stats.dbots.enabled) {
    postStats(bot.Guilds.length, bot)
  } else {
    // Omit
  }
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
                y.message.channel.sendMessage(`**Command list for Logger:**\n \n${cmdArray.join('\n')}\n \nPlease note that all commands may not be usable for you. Use \`${Config.core.prefix}help <command>\` for more info.`)
              } else {
                logger.info(`Executing command "${cmdObj}" from user ${y.message.author.username} (Server ID: ${y.message.guild.id})`)
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

bot.Dispatcher.on('CHANNEL_UPDATE', (c) => {
  channelUpdated(c, bot)
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

bot.Dispatcher.on('GUILD_ROLE_DELETE', (u) => {
  guildRoleDeleted(u, bot)
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

process.on('unhandledRejection', (reason, promise) => {
  logger.debug(`There was an unhandled promise rejection at Promise ${promise}, reason was ${reason}`)
})

if (Config.stats.dbots.enable === true) {
  // Post stats to Discord Bots every 3 hours
  setInterval(_ => { postStats(bot.Guilds.length, bot) }, 10800000)
} else {
  // Omit
}
