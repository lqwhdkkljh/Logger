const perms = {
  NO_PERMISSION: 'You don\'t have permission to do this.',
  NOT_ALLOWED: 'Ask the server owner, user with Administrator/Manager Server permissions or a developer to perform this function.',
  NOT_OWNER: 'Ask the server owner to perform this function.',
  NOT_DEV: 'Ask one of my developers to perform this function.'
}
const flags = {
  FLAG_PROHIBIT_1: 'You cannot do that! This command is ',
  FLAG_PROHIBIT_2: '. Hence I will not tell you about this command.'
}

/*
Permissions:

NO_PERMISSION: Generic response for when a user doesn't have permission to execute a command.
NOT_ALLOWED: Response for when the command needs to be performed by a server owner or the bot's developers, or a user with proper permissions.
NOT_OWNER: Shorter formatting for the above which assumes that it's obvious for devs to be able to perform any command.
NOT_DEV: Response for when a command needs to be performed by one of the bot's developers.

Flags:

FLAG_PROHIBIT_1: First part of when a command flag prevents execution.
FLAG_PROHIBIT_2: Second part of above.
*/

export { perms, flags }
