const Commands = []

Commands.ping = {
  func: function (msg) {
    msg.reply('Pong!')
  }
}

Commands.info = {
  func: function (msg) {
    let data = {
      'title': "Hey there, I'm Logger!",
      'description': "I'm a simple Discord bot for logging different events in your Discord server.",
      'color': 6485980,
      'thumbnail': {
        'url': 'https://images-ext-1.discordapp.net/.eJwFwdERgyAMANBdGIBgoBDcJgZo69nKAfrjubvvXepom5rVZ4zaZwBJf52-XfaWuFYt-w_45MGtA0YiREfWeBNpCt7AZHKQhV3x1nJ2OdmyMEVGwRLKi_Ra3-p-AFhtHvQ.PyEwIenKAFjWGFxIKcb6-_i167A?width=80&height=80'
      },
      'image': {
        'url': 'https://avatars0.githubusercontent.com/u/18148938?v=3&s=180'
      },
      'fields': [
        {
          'name': 'Who am I?',
          'value': "I'm a bot that can do some logging in your Discord server, for instance join and leave notifications!"
        },
        {
          'name': 'Who created me?',
          'value': "I was developed by LWTech#7575 and Piero#0905. I'm written in JavaScript Node.js and my library is [discordie](http://qeled.github.io/discordie)."
        },
        {
          'name': 'Where can I get help or give suggestions?',
          'value': "You can join my home server, LW's Lodge! There you can get help or suggest new features. Join here: https://discord.gg/NaN39J8"
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

export { Commands }
