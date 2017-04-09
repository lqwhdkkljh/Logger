const Config = require('../config.json')

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
  console.log(e)
  createTable().then((e) => {
    console.log(e)
    cleanAndExit()
    }).catch(e => {
      console.log(e.msg)
      if (e.startsWith("TypeError:")) {
        console.log('No connections to clean or close.')
      } else {
        console.log(e)
      }
    })
  }).catch(e => {
    console.log(e)
  }).catch(e => {
  if (e.msg === 'None of the pools have an opened connection and failed to open a new one') {
    console.log('Failed to connect to the database, is it running?')
  } else {
    console.log(`Unhandled error:\n${e}`)
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
