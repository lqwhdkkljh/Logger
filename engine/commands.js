const Commands = []
const Config = require('../config.json')
import { updateLogChannel } from '../databases/guild'
import { checkIfDev, checkIfAllowed } from './permissions'
import * as lang from './lang'
import fs from 'fs'
import { logger } from './logger'

const oauth = 'https://discordapp.com/oauth2/authorize?client_id=298822483060981760&scope=bot&permissions=1140968576'

Commands.help = {
  name: 'help',
  info: 'Gets help about a command, if there is any.',
  func: function (msg, suffix) {
    let isDev = checkIfDev(msg)
    if (!Commands[suffix]) {
      msg.channel.sendMessage('Command not found.')
    } else {
      if (isDev) {
        msg.channel.sendMessage(`Name: **${Commands[suffix].name}**\nInformation: **${Commands[suffix].info}**\nRequired position: **${Commands[suffix].needs}**.`)
      } else {
        if (Commands[suffix].hasOwnProperty('hidden') && Commands[suffix].hidden === true) {
          msg.channel.sendMessage('Command not found.')
        } else if (Commands[suffix].hasOwnProperty('needs') && Commands[suffix].needs !== null) {
          msg.channel.sendMessage(`Name: **${Commands[suffix].name}**\nInformation: **${Commands[suffix].info}**\nRequired position: **${Commands[suffix].needs}**.`)
        } else {
          msg.channel.sendMessage(`Name: **${Commands[suffix].name}**\nInformation: **${Commands[suffix].info}**`)
        }
      }
    }
  }
}

Commands.setchannel = {
  name: 'setchannel',
  info: 'Sets the log channel for your server!',
  needs: 'Server Owner',
  func: function (msg, suffix) {
    let isAllowed = checkIfAllowed(msg)
    if (isAllowed) {
      updateLogChannel(msg)
    } else {
      msg.reply(`${lang.perms.NO_PERMISSION} ${lang.perms.NOT_ALLOWED}`)
    }
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

Commands.eval = {
  name: 'eval',
  info: 'Evaluate JavaScript!', // Yes, Piero, casing does matter
  needs: 'Bot Developer',
  hidden: true,
  func: function (msg, suffix, bot) {
    let isDev = checkIfDev(msg)
    if (isDev) {
      try {
        const util = require('util')
        let evaluated = eval(suffix) // eslint-disable-line no-eval
        let sendEval = util.inspect(evaluated, {
          depth: 1
        })
        sendEval = sendEval.replace(new RegExp(Config.core.token, 'gi'), 'censored') // Thanks WildBeast
        sendEval = sendEval.replace(new RegExp(Config.pastebin.devkey, 'gi'), 'censored')
        if (sendEval.length >= 2000) {
          sendEval = sendEval.substr(0, 1990) + '(cont)'
          msg.channel.sendMessage('```xl\n' + sendEval + '```').then((m) => {
            m.edit('```xl\n' + sendEval + '```')
          })
        } else {
          let init = new Date(msg.timestamp)
          msg.channel.sendMessage('```xl\n' + sendEval + '```').then((m) => {
            m.edit(`Eval done in \`${Math.floor(new Date(m.timestamp) - init)}\` ms!\n` + '```xl\n' + sendEval + '```')
          })
        }
      } catch (e) {
        msg.channel.sendMessage('Error:\n' + '```xl\n' + e + '```')
      }
    } else {
      // Ignore
    }
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
        'url': 'http://images.lwtechgaming.me/rE85Jmf.jpg'
      },
      'image': {
        'url': 'https://avatars0.githubusercontent.com/u/18148938?v=3&s=100'
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
        'value': 'You can join my home server, LW\'s Lodge! There you can get help or suggest new features. Join [here](https://discord.gg/NaN39J8)!'
      },
      {
        'name': 'What if I want to contribute?',
        'value': 'My code is open source and improvements are appreciated! Check me out on GitHub: https://github.com/LWTechGaming/Logger'
      }]
    }
    msg.channel.sendMessage(' ', false, data)
  }
}

Commands.invite = {
  name: 'invite',
  info: 'Return the OAuth URL to invite me to your server!',
  func: function (msg, bot) {
    msg.channel.sendMessage(`🔗 ${oauth}`)
  }
}

Commands.setstatus = {
  name: 'setstatus',
  info: 'Sets current playing game for the bot.',
  needs: 'Bot Developer',
  func: function (msg, suffix, bot) {
    let isDev = checkIfDev(msg)
    if (isDev) {
      bot.User.setStatus('online', suffix)
      msg.channel.sendMessage(`Set status to \`${suffix}\`!`)
    } else {
      msg.reply(`${lang.perms.NO_PERMISSION} ${lang.perms.NOT_DEV}`)
    }
  }
}

Commands.setavatar = {
  name: 'setavatar',
  info: 'Sets a new avatar for the bot.',
  needs: 'Bot Developer',
  func: function (msg, suffix, bot) {
    let isDev = checkIfDev(msg)
    if (isDev) {
      try {
        bot.User.setAvatar(fs.readFileSync(suffix))
        msg.channel.sendMessage(`Avatar updated!`)
      } catch (err) {
        msg.reply('an error occurred while setting the avatar! Check console for details.')
        logger.error(err)
      }
    } else {
      msg.reply(`${lang.perms.NO_PERMISSION} ${lang.perms.NOT_DEV}`)
    }
  }
}

export { Commands }
