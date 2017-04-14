import Discordie from 'discordie'
const bot = new Discordie()
export { bot }

const argv = require('yargs').argv

import * as utils from './engine/utilities'
import { logger } from './engine/logger'
import { Commands } from './engine/commands'
import { guildCreate, guildDelete, pingDatabase } from './databases/guild'
import { voiceJoin, voiceLeave } from './databases/voice'
import { guildJoin, guildLeave, guildBan, guildUnban } from './databases/server'
import { messageUpdate, messageDelete } from './databases/message'

process.title = 'Logger'

if (argv.dev === true) {
  logger.info('Starting in developer mode...')
} else {
  logger.info('Starting...')
}

// Verify RethinkDB is running
pingDatabase()

// Verify config exists
utils.fileExists('./config.json')

// If found, require
const Config = require('./config.json')

try {
  bot.connect({ token: Config.core.token })
} catch (err) {
  if (argv.dev === true) {
    logger.error('Error while logging in: ')
    logger.error(err)
  } else {
    logger.error('An error occurred while logging in, invalid credentials?')
  }
  process.exit()
}

bot.Dispatcher.on('GATEWAY_READY', x => {
  logger.info(`Successfully logged in!\nUser: ${bot.User.username}\nID: ${bot.User.id}`)
})

bot.Dispatcher.on('MESSAGE_CREATE', y => {
  let prefix = Config.core.prefix
  if (y.message.content.startsWith(prefix)) {
    if (y.message.author.bot || y.message.author.id === bot.User.id) {
    } else {
      let cmdObj = y.message.content.substring(prefix.length).split(' ')[0].toLowerCase()
      let keys = Object.keys(Commands)
      let splitSuffix = y.message.content.substr(Config.core.prefix.length).split(' ')
      let suffix = splitSuffix.slice(1, splitSuffix.length).join(' ')

      if (keys.includes(cmdObj)) {
        try {
          let botPerms = bot.User.permissionsFor(y.message.channel)
          if (!botPerms.Text.READ_MESSAGES || !botPerms.Text.SEND_MESSAGES) {
          } else {
            Commands[cmdObj].func(y.message, suffix, bot)
          }
        } catch (err) {
          if (argv.dev === true) {
            logger.error(`An error occurred while executing command '${cmdObj}', error returned:\n${err}`)
          } else {
            logger.error(`An error occurred while executing command '${cmdObj}'!`)
          }
        }
      }
    }
  }
})

bot.Dispatcher.on('GUILD_CREATE', (g) => {
  guildCreate(g)
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

bot.Dispatcher.on('GUILD_MEMBER_ADD', (m) => {
  guildJoin(m, bot)
})

bot.Dispatcher.on('GUILD_MEMBER_REMOVE', (u) => {
  guildLeave(u, bot)
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
