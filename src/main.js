import Discordie from 'discordie'
import * as utils from './engine/utilities'

process.title = 'Logger'

const bot = new Discordie()

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
