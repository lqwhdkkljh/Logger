const Promise = require('promise')
const Dash = require('rethinkdbdash')
let r = new Dash({
  user: 'admin',
  password: '',
  silent: true,
  servers: [{
    host: 'localhost',
    port: '28015'
  }]
})
createDB().then((e) => {
  console.log(e)
  createTable().then((e) => {
    cleanAndExit().then((e) => {
      console.log(e)
    }).catch(e => {
      console.log(e)
    })
  }).catch(e => {
    console.log(e)
  })
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
      if (err.msg) {
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
