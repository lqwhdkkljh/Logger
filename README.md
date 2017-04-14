<p style="text-align: center";>
<img src="./res/Logger.png"></p>

Logger is a simple Discord bot for logging different events in your Discord server. It's coded in Node.js, using the discordie library to interact with the Discord API.

## Features

This bot currently supports setting a custom log channel on a per-server basis. When a log channel is set it will then log events to that channel.

**Current loggable events:**

| Event | Log type | Event name |
| ----- | -------- | ------------ |
| User joins server | Embed | `GUILD_MEMBER_ADD` |
| User leaves server | Embed | `GUILD_MEMBER_REMOVE` |
| User gets banned | Message | `GUILD_BAN_ADD` |
| User gets unbanned | Message | `GUILD_BAN_REMOVE` |
| User joins voice channel | Message | `VOICE_CHANNEL_JOIN` |
| User leaves voice channel | Message | `VOICE_CHANNEL_LEAVE` |

## Commands

**Command list:**

| Command | Description |
| ------- | ----------- |
| %help \<command\> | Return description of a command specified. | 
| %ping | Return pseudo-ping for the bot. |
| %setchannel | Set the logging channel to the current channel. |
| %info | Return some info on the bot. |


## Maintainers

Current code maintainers are [LWTechGaming](https://github.com/LWTechGaming) and [Piero AKA caf203](https://github.com/caf203). For full information, check the [maintainers file](MAINTAINERS.md).

## Discord server

If you want to chat with the developers, get help or just hang out, feel free to join LW's Lodge on Discord! Click the banner below to get started.

<p align="center">
  <a href="https://discord.gg/NaN39J8"><img src="https://discordapp.com/api/guilds/293097624246943744/widget.png?style=banner2" alt="Discord server"></a>
</p>

---

"Discord", "Discord App", and any associated logos are registered trademarks of Hammer & Chisel, inc.
