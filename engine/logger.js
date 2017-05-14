import winston from 'winston'
const Config = require('../config.json')

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: 'all',
      level: 'verbose',
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: true
})

function pushAdminLog (msg, bot) {
  let ac = Config.ids.adminChannel
  bot.Channels.get(ac).sendMessage(msg)
}

export { logger, pushAdminLog }
