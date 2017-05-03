import winston from 'winston'

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

export { logger }
