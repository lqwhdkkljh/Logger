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

function voiceJoin (v, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': v.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let date = new Date()
    let minutes = date.getMinutes()
    minutes <= 10 ? minutes = `0${date.getMinutes()}` : minutes = date.getMinutes()
    logChannel.sendMessage(`📞 [\`${date.getHours()}:${minutes}\`] User \`${v.user.username}#${v.user.discriminator}\` has joined voice channel *${v.channel.name}*.`)
  })
}

function voiceLeave (v, bot) {
  r.db('Guilds').table('all').filter({
    'guildID': v.guildId
  }).run().then((lc) => {
    let logChannel = bot.Channels.get(`${lc[0].logchannel}`)
    let date = new Date()
    let minutes = date.getMinutes()
    minutes <= 10 ? minutes = `0${date.getMinutes()}` : minutes = date.getMinutes()
    if (!v.newChannelId) {
      logChannel.sendMessage(`📞 [\`${date.getHours()}:${minutes}\`] User \`${v.user.username}#${v.user.discriminator}\` has left voice channel *${v.channel.name}*.`)
    } else {
      let newVoiceChannel = bot.Channels.get(`${v.newChannelId}`)
      logChannel.sendMessage(`📞 [\`${date.getHours()}:${minutes}\`] User \`${v.user.username}#${v.user.discriminator}\` has changed voice channels from *${v.channel.name}* to *${newVoiceChannel.name}*.`)
    }
  })
}

export {
  voiceJoin,
  voiceLeave
}
