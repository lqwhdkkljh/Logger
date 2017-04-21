const perms = {
  NO_PERMISSION: 'sorry! You don\'t have permission to do this.', // Intentional lowercase for reply
  NOT_ALLOWED: 'Ask the server owner or a bot developer to perform this function.',
  NOT_OWNER: 'Ask the server owner to perform this function.',
  NOT_DEV: 'Ask one of my developers to perform this function.'
}

/*
NO_PERMISSION: Generic response for when a user doesn't have permission to execute a command.
NOT_ALLOWED: Response for when the command needs to be performed by a server owner or the bot's developers.
NOT_OWNER: Shorter formatting for the above which assumes that it's obvious for devs to be able to perform any command.
NOT_DEV: Response for when a command needs to be performed by one of the bot's developers.
*/

export { perms }
