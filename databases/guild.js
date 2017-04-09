const Config = require('../config.json')

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
        console.log(`Success while creating guild info for server '${g.guild.name}!`)
      } else {
        console.log(`Something went wrong while creating guild info for server ${g.guild.name}!`)
      }
    })
  } catch (e) {
    console.log(`An error occured while creating guild information! ${e}`)
  }
}

function guildDelete (g) {
  try {
    r.db('Guilds').table('all').filter({
      'guildID': g.data.id
    }).delete().run().then((d) => {
      if (d.deleted === 1) {
        console.log(`Successfully deleted guild information for ${g.data.name} (${g.data.id})`)
      }
    })
  } catch (e) {
    console.log(`An error has occured while deleting guild! \n${e}`)
  }
}

function updateLogChannel (msg) {
  r.db('Guilds').table('all').filter({
    'guildID': msg.guild.id
  }).update({
    'logchannel': msg.channel.id}).run().then((u) => {
      if (u.replaced === 1) {
        console.log('Successfully updated logchannel!')
        msg.channel.sendMessage(`Alright ${msg.author.mention}, I will send messages to "${msg.channel.name}" (${msg.channel.id})!`)
      } else if (u.unchanged === 1) {
        msg.channel.sendMessage(`I'm already sending log messages to channel "${msg.channel.name}", ${msg.author.mention}!`)
      } else {
        console.log(`A problem has occurred, check it out!\n${u}`)
      }
    })
}

function getLogChannel (msg, bot, cb) {
  r.db('Guilds').table('all').filter({'guildID': msg.guild.id}).run().then((y) => {
    if (y === null) {
      console.log(`I don't have information for guild "${msg.guild.name}"`)
    } else {
      let id = y[0].logchannel
      let logChannel = bot.Channels.get(`${id}`)
      cb(logChannel)
    }
  })
}

export {
    guildCreate,
    guildDelete,
    updateLogChannel,
    getLogChannel
}
