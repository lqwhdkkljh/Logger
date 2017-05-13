const Config = require('../config.json')
import { logger } from '../engine/logger'

import { bot } from '../Logger'
const ac = bot.Channels.get(Config.ids.adminChannel)

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

function guildCreate (g, bot) {
  try {
    r.db('Guilds').table('all').insert({
      'guildID': g.guild.id,
      'guildName': g.guild.name,
      'ownerID': g.guild.owner_id,
      'logchannel': ''
    }).run().then((r) => {
      if (r.inserted === 1) {
        bot.Users.get(g.guild.owner_id).openDM().then((dm) => {
          dm.sendMessage(`**Hello, thanks for inviting me to your server!**\n
    I'll start logging events as soon as you set me a channel to do that in. Please browse to the channel you would like logging to be put in and type \`${Config.core.prefix}setchannel\` there.\n
    When you've done that, you're all set! Have a good time :smile:`)
        })
        ac.sendMessage(`Joined server ${g.guild.name} (${g.guild.id}) and created guild info successfully.`)
      } else {
        logger.error(`Something went wrong while creating guild info for server ${g.guild.name}: DATA_CREATION_FAILED`)
        ac.sendMessage(`Failed to create guild info for server ${g.guild.name} (${g.guild.id}), unknown error.`)
      }
    })
  } catch (e) {
    logger.error(`An error occured while creating guild information for server "${g.guild.name}" (${g.guild.id}): \n${e}`)
    ac.sendMessage(`Failed to create guild info for server ${g.guild.name} (${g.guild.id}), check console for details.`)
  }
}

function guildDelete (g) {
  try {
    r.db('Guilds').table('all').filter({
      'guildID': g.data.id
    }).delete().run().then((d) => {
      if (d.deleted === 1) {
        // all good, ignore
      }
    })
  } catch (e) {
    logger.error(`An error occured while deleting guild information for server ${g.guildId}: \n${e}`)
    // I think this is enough, obsolete guild info is not harmful
  }
}

function updateLogChannel (msg) {
  r.db('Guilds').table('all').filter({
    'guildID': msg.guild.id
  }).update({
    'logchannel': msg.channel.id}).run().then((u) => {
      if (u.replaced === 1) {
        msg.channel.sendMessage(`Alright ${msg.author.mention}, I will send messages to "${msg.channel.name}" (${msg.channel.id})!`)
      } else if (u.unchanged === 1) {
        msg.channel.sendMessage(`I'm already sending log messages to channel "${msg.channel.name}", ${msg.author.mention}!`)
      } else {
        logger.error(`An error occurred while updating log channel for server "${msg.guild.name}" (${msg.guild.id}):\n${u}`)
        ac.sendMessage(`Failed to update log channel for server ${msg.guild.name} (${msg.guild.id}), check console for details.`)
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

export { guildCreate, guildDelete, updateLogChannel, pingDatabase }
