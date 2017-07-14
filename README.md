<p style="text-align: center";>
<img src="./res/Logger.png"></p>

**Logger is due for a rewrite!**

Logger is a simple Discord bot for logging different events in your Discord server. It's coded in Node.js, using the discordie library to interact with the Discord API.

Click this link to invite the bot to your server: http://logger.lwtechgaming.me

## Features

This bot currently supports setting a custom log channel on a per-server basis. When a log channel is set it will then log events to that channel.

**Current loggable events:**

| Event | Log type | Event name |
| ----- | -------- | ------------ |
| User joins server | Embed | `GUILD_MEMBER_ADD` |
| User leaves server | Embed | `GUILD_MEMBER_REMOVE` |
| User info is updated | Embed | `GUILD_MEMBER_UPDATE` |
| Emoji added/removed | Message | `GUILD_EMOJI_UPDATE` |
| User gets banned | Message | `GUILD_BAN_ADD` |
| User gets unbanned | Message | `GUILD_BAN_REMOVE` |
| User joins voice channel | Message | `VOICE_CHANNEL_JOIN` |
| User leaves voice channel | Message | `VOICE_CHANNEL_LEAVE` |
| Channel created | Message | `CHANNEL_CREATE` |
| Channel deleted | Message | `CHANNEL_DELETE` |
| Message is edited | Message | `MESSAGE_UPDATE` |
| Message is deleted | Message | `MESSAGE_DELETE` |
| Multiple messages are deleted | Message | `MESSAGE_DELETE_BULK` |

As a recent feature we've also introduced audit log integration for logging. This means that additional info for the events above is provided with each log entry.

**Please note:** We use Trello as our progress tracker, you can read what's going on with the bot here: https://trello.com/b/6hDyOJtL/logger

## Commands

**End users**

| Command | Description | Role required |
| ------- | ----------- | ------------- |
| %help \<command\> | Return description of a command specified. | None |
| %ping | Return pseudo-ping for the bot. | None |
| %info | Return some info on the bot. | None |
| %invite | Invite the bot to a server. | None |
| %setchannel | Set the logging channel to the current channel. | Server Owner |
| %clearchannel | Clear the logging channel for the server. | Server Owner |

**Developer tools**

| Command | Description | Role required |
| ------- | ----------- | ------------- |
| %eval | Evaluate JavaScript code. | Developer |
| %setstatus \<text\> | Set current playing status. | Developer |
| %setavatar \<filename\> | Set a new avatar. Needs file on local disk. | Developer |
| %recoverguilds | Attempts to recover missing guild data. | Developer |
| %botinfo | Gets information of a bot from [Discord Bots](http://bots.discord.pw). | Developer | 



## Maintainers

Current code maintainers are [LWTechGaming](https://github.com/LWTechGaming) and [Piero AKA caf203](https://github.com/caf203). For full information, check the [maintainers file](MAINTAINERS.md).

## Discord server

If you want to chat with the developers, get help or just hang out, feel free to join LW's Lodge on Discord! Click the banner below to get started.

<p align="center">
  <a href="https://discord.gg/NaN39J8"><img src="https://discordapp.com/api/guilds/293097624246943744/widget.png?style=banner2" alt="Discord server"></a>
</p>

---

"Discord", "Discord App", and any associated logos are registered trademarks of Hammer & Chisel, inc.
