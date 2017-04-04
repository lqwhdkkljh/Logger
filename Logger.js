import Discordie from 'discordie'
const bot = new Discordie()

import * as utils from './engine/utilities'
import { Commands } from './engine/commands'

process.title = 'Logger'

// Verify config exists
utils.fileExists('./config.json')

// If found, require
const Config = require('./config.json')

try {
  bot.connect({ token: Config.core.token })
} catch (err) {
  console.log('Error encountered when logging in: ' + err)
  console.log('Exiting...')
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
      let cmd = y.message.content.substring(prefix.length)
      let cmdObj = cmd.split(' ')[0].toLowerCase()
      let keys = Object.keys(Commands)

      if (keys.includes(cmdObj)) {
        try {
          Commands[cmdObj].func(y.message)
        } catch (err) {
          console.log('An error occurred while executing command ' + cmdObj + ', error returned:')
          console.log(err)
        }
      }
    }
  }
})
