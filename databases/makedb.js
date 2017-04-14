const Config = require('../config.json')
import { logger } from '../engine/logger'

const Promise = require('promise')
const Dash = require('rethinkdbdash')

let r = new Dash({
  user: Config.database.user,
  password: Config.database.pass,
  silent: true,
  servers: [{
    host: Config.database.host,
    port: Config.database.pass
  }]
})

createDB().then((e) => {
  logger.error(e)
  createTable().then((e) => {
    logger.error(e)
    cleanAndExit()
  }).catch(e => {
    logger.error(e.msg)
    if (e.startsWith('TypeError:')) {
      logger.error('No connections to clean or close.')
    } else {
      logger.error(e)
    }
  })
}).catch(e => {
  logger.error(e)
}).catch(e => {
  if (e.msg === 'None of the pools have an opened connection and failed to open a new one') {
    logger.error('Failed to connect to the database, is it running?')
  } else {
    logger.error(`Unhandled error:\n${e}`)
  }
  cleanAndExit()
})

function createDB () {
  return new Promise(function (resolve, reject) {
    r.dbCreate('Guilds').run().then((g) => {
      resolve('Database "Guilds" created!')
    }).catch(err => {
      if (err.msg === 'Database `Guilds` already exists.') {
        resolve(err.msg)
      } else {
        reject(err)
      }
    })
  })
}

function createTable () {
  return new Promise(function (resolve, reject) {
    r.db('Guilds').tableCreate('all').run().then((tb) => {
      resolve('Table "all" created!')
    }).catch(err => {
      if (err.msg === 'Table `Guilds.all` already exists.') {
        resolve('The "all" table already exists.')
      } else {
        reject(err)
      }
    })
  })
}

function cleanAndExit () {
  r.getPoolMaster().drain().then(() => {
    process.exit()
  })
}
