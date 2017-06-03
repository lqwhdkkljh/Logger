import { updateLogChannel, removeLogChannel, checkAndReplace } from '../databases/guild'
import { checkIfDev, checkIfAllowed } from './permissions'
import * as lang from './lang'
import fs from 'fs'
import { logger } from './logger'
import { getBotInfo } from './stats'

const Commands = []
const Config = require('../config.json')
const oauth = 'http://logger.lwtechgaming.me'

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
  func: function (msg, suffix, bot) {
    let isAllowed = checkIfAllowed(msg)
    if (isAllowed) {
      updateLogChannel(msg, bot)
    } else {
      msg.reply(`${lang.perms.NO_PERMISSION} ${lang.perms.NOT_ALLOWED}`)
    }
  }
}

Commands.clearchannel = {
  name: 'clearchannel',
  info: 'Clears the log channel for the server.',
  needs: 'Server Owner',
  func: function (msg, suffix, bot) {
    let isAllowed = checkIfAllowed(msg)
    if (isAllowed) {
      removeLogChannel(msg, bot)
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

Commands.recoverguilds = {
  name: 'recoverguilds',
  info: 'Tries to replace missing guild documents.',
  needs: 'Bot Developer',
  func: function (msg, suffix, bot) {
    bot.Guilds.map((g) => {
      checkAndReplace(g, bot)
    })
    msg.channel.sendMessage(`Alright, ${msg.author.mention}. Check the logs to see the results (too long)`)
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
      'timestamp': new Date(),
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
        'value': 'I\'m a bot that can do some logging in your Discord server, for instance join and leave notifications, ban and unban and so forth!'
      },
      {
        'name': 'Who created me?',
        'value': 'I was developed by LWTech#7575 and Piero#0905. I\'m written in JavaScript Node.js and my library is [discordie](http://qeled.github.io/discordie).'
      },
      {
        'name': 'Can I get you into my own server?',
        'value': 'Sure! Click [this](http://logger.lwtechgaming.me) to add me to your server.'
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
    msg.channel.sendMessage(`🔗 Invite me to your server: ${oauth}`)
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

Commands.botinfo = {
  name: 'botinfo',
  info: 'Gets information of a bot from Discord Bots.',
  needs: 'Bot Developer',
  hidden: true,
  func: function (msg, suffix, bot) {
    if (!suffix) {
      msg.reply('Please provide an ID to get information for!')
    } else {
      let isDev = checkIfDev(msg)
      if (isDev) {
        getBotInfo(suffix, bot).then((r) => {
          let data = {
            'title': `Stats for bot ${r.body.name}`,
            'description': 'Note: Avatars are not submitted by the API and are hence not rendered.',
            'url': `https://bots.discord.pw/bots/${r.body.user_id}`,
            'color': 6485980,
            'timestamp': new Date(),
            'footer': { 'icon_url': `${bot.User.avatarURL}`, 'text': 'Logger' },
            'fields': [{
              'name': 'Name:',
              'value': `${r.body.name}`
            },
            {
              'name': 'Description:',
              'value': `${r.body.description}`
            },
            {
              'name': 'Library:',
              'value': `${r.body.library}`
            },
            {
              'name': `Invite URL`,
              'value': `[Click here to invite](${r.body.invite_url})`
            },
            {
              'name': 'Prefix:',
              'value': `${r.body.prefix}`
            }]
          }
          msg.channel.sendMessage(' ', false, data)
        })
      } else {
        msg.reply(`${lang.perms.NO_PERMISSION} ${lang.perms.NOT_DEV}`)
      }
    }
  }
}

export { Commands }
