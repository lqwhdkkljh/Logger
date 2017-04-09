import Discordie from 'discordie'
const bot = new Discordie()

const argv = require('yargs').argv

import * as utils from './engine/utilities'
import { Commands } from './engine/commands'
import { guildCreate, guildDelete } from './databases/guild.js'
import { voiceJoin, voiceLeave } from './databases/voice.js'

process.title = 'Logger'

if (argv.dev === true) {
  console.log('Starting in developer mode...')
} else {
  console.log('Starting...')
}

// Verify config exists
utils.fileExists('./config.json')

// If found, require
const Config = require('./config.json')

try {
  bot.connect({ token: Config.core.token })
} catch (err) {
  if (argv.dev === true) {
    console.log('Error while logging in: ')
    console.log(err)
  } else {
    console.log('An error occurred while logging in, invalid credentials?')
  }
  process.exit()
}

bot.Dispatcher.on('GATEWAY_READY', x => {
  console.log('Successfully logged in!')
  console.log('User: ' + bot.User.username)
  console.log('ID: ' + bot.User.id)
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
          Commands[cmdObj].func(y.message, suffix, bot)
        } catch (err) {
          if (argv.dev === true) {
            console.log('An error occurred while executing command "' + cmdObj + '", error returned:')
            console.log(err)
          } else {
            console.log('An error occurred while executing command "' + cmdObj + '"!')
          }
        }
      }
    }
  }
})

bot.Dispatcher.on('GUILD_CREATE', (g) => {
  guildCreate(g)
  // guildCreate(g)
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

export {
  bot
}
