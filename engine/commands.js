const Commands = []

Commands.ping = {
  func: function (msg) {
    msg.reply('Pong!')
  }
}

export { Commands }
