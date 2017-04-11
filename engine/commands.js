const Commands = []
import { guildCreate, updateLogChannel } from '../databases/guild'

Commands.help = {
  name: 'help',
  info: 'Gets help about a command, if there is any.',
  func: function (msg, suffix) {
    if (!Commands[suffix]) {
      msg.channel.sendMessage('Command not found.')
    } else {
      msg.channel.sendMessage(`${Commands[suffix].info}`)
    }
  }
}

Commands.setchannel = {
  name: 'setchannel',
  info: 'Sets the log channel for your server!',
  func: function (msg, suffix) {
    updateLogChannel(msg)
  }
}

Commands.initguild = {
  name: 'initguild',
  info: 'Creates a database for the current guild.',
  func: function (g) {
    guildCreate(g)
  }
}

Commands.ping = {
  name: 'ping',
  info: 'Gets pseudo-ping.',
  func: function (msg) {
    msg.channel.sendMessage('Pong!').then((m) => {
      m.edit(`Pong! Pseudo-ping: ${Math.floor(new Date(m.timestamp) - new Date(msg.timestamp))} MS`)
    })
  }
}

Commands.info = {
  name: 'info',
  info: 'Information about me!',
  func: function (msg) {
    let data = {
      'title': 'Hey there, I\'m Logger!',
      'description': 'I\'m a simple Discord bot for logging different events in your Discord server.',
      'color': 6485980,
      'thumbnail': {
        'url': 'https://images-ext-1.discordapp.net/.eJwFwdERgyAMANBdGIBgoBDcJgZo69nKAfrjubvvXepom5rVZ4zaZwBJf52-XfaWuFYt-w_45MGtA0YiREfWeBNpCt7AZHKQhV3x1nJ2OdmyMEVGwRLKi_Ra3-p-AFhtHvQ.PyEwIenKAFjWGFxIKcb6-_i167A?width=80&height=80'
      },
      'image': {
        'url': 'https://avatars0.githubusercontent.com/u/18148938?v=3&s=180'
      },
      'fields': [{
        'name': 'Who am I?',
        'value': 'I\'m a bot that can do some logging in your Discord server, for instance join and leave notifications!'
      },
      {
        'name': 'Who created me?',
        'value': 'I was developed by LWTech#7575 and Piero#0905. I\'m written in JavaScript Node.js and my library is [discordie](http://qeled.github.io/discordie).'
      },
      {
        'name': 'Where can I get help or give suggestions?',
        'value': 'You can join my home server, LW\'s Lodge! There you can get help or suggest new features. Join here: https://discord.gg/NaN39J8'
      },
      {
        'name': 'What if I want to contribute?',
        'value': 'My code is open source and improvements are appreciated! Check me out on GitHub: https://github.com/LWTechGaming/Logger'
      }
      ]
    }
    msg.channel.sendMessage('Information about Logger:', false, data)
  }
}

export {
  Commands
}
