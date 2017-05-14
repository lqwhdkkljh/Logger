const Config = require('../config.json')
import * as pastebin from 'better-pastebin'
import { logger, pushAdminLog } from './logger'
import { randstr } from './utils'

function generatePaste (channel, content, bot) {
  pastebin.setDevKey(Config.pastebin.devkey)
  pastebin.create({
    contents: content,
    name: `${randstr(10)}`,
    privacy: 1  // Default to unlisted
  }, (success, data) => {
    if (success) {
      channel.sendMessage(`${data}`)
    } else {
      logger.error(`An error occurred while creating a paste for deleted messages: ${data}`)
      pushAdminLog(`Encountered error while creating a paste for deleted messages, check console for details.`, bot)
    }
  })
}

export { generatePaste }
