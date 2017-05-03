const Config = require('../config.json')
import * as pastebin from 'better-pastebin'
import { logger } from './logger'
import { randstr } from './utils'

function generatePaste (channel, content) {
  pastebin.setDevKey(Config.pastebin.devkey)
  pastebin.create({
    contents: content,
    name: `${randstr(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}`,
    privacy: 1  // Default to unlisted
  }, (success, data) => {
    if (success) {
      channel.sendMessage(`${data}`)
    } else {
      logger.error('An error occurred while creating the paste!')
      logger.error(data)
    }
  })
}

export { generatePaste }
