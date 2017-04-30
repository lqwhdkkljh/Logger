const Config = require('../config.json')
import { logger } from '../engine/logger'

const Dash = require('rethinkdbdash')
let r = new Dash({
  user: Config.database.user,
  password: Config.database.pass,
  silent: true,
  servers: [{
    host: Config.database.host,
    port: Config.database.port
  }]
})

function guildCreate (g) {
  try {
    r.db('Guilds').table('all').insert({
      'guildID': g.guild.id,
      'guildName': g.guild.name,
      'ownerID': g.guild.owner_id,
      'logchannel': ''
    }).run().then((r) => {
      if (r.inserted === 1) {
        logger.info(`Success while creating guild info for server '${g.guild.name}!`)
      } else {
        logger.error(`Something went wrong while creating guild info for server ${g.guild.name}!`)
      }
    })
  } catch (e) {
    logger.error(`An error occured while creating guild information! ${e}`)
  }
}

function guildDelete (g) {
  try {
    r.db('Guilds').table('all').filter({
      'guildID': g.data.id
    }).delete().run().then((d) => {
      if (d.deleted === 1) {
        logger.info(`Successfully deleted guild information for ${g.data.name} (${g.data.id})`)
      }
    })
  } catch (e) {
    logger.error(`An error has occured while deleting guild! \n${e}`)
  }
}

function updateLogChannel (msg) {
  r.db('Guilds').table('all').filter({
    'guildID': msg.guild.id
  }).update({
    'logchannel': msg.channel.id}).run().then((u) => {
      if (u.replaced === 1) {
        logger.info('Successfully updated logchannel!')
        msg.channel.sendMessage(`Alright ${msg.author.mention}, I will send messages to "${msg.channel.name}" (${msg.channel.id})!`)
      } else if (u.unchanged === 1) {
        msg.channel.sendMessage(`I'm already sending log messages to channel "${msg.channel.name}", ${msg.author.mention}!`)
      } else {
        logger.error(`A problem has occurred, check it out!`)
        logger.error(u)
      }
    })
}

function pingDatabase () {
  r.expr(1).run().then(response => {
    logger.info('Successfully connected to database!')
  }).catch(err => {
    if (err.msg === 'None of the pools have an opened connection and failed to open a new one') {
      logger.error(`Failed to connect to the database, verify RethinkDB is running!\nError: ${err}`)
    } else {
      logger.error(`Error occurred while connecting to the database:\n${err}`)
    }
  })
}

export {
    guildCreate,
    guildDelete,
    updateLogChannel,
    pingDatabase
}
