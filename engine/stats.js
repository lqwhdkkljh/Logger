import * as request from 'superagent'
import { logger, pushAdminLog } from './logger.js'

const Config = require('../config.json')
const token = Config.stats.dbots.token
const botId = Config.stats.dbots.bot_id
const baseUrl = 'https://bots.discord.pw/api'

function getBotInfo (id, bot) {
  return new Promise(function (resolve, reject) {
    if (!Config.stats.dbots.enabled) {
      resolve(`Discord Bots functions have been turned off. Enable them in the config to use this command.`)
    } else {
      request
      .get(`${baseUrl}/bots/${id}`)
      .set(`Authorization`, `${token}`)
      .end(function (error, response) {
        if (error) {
          pushAdminLog(`An error occurred while getting bot stats. Check console for details.`, bot)
          logger.error(`Error while getting bot info from Discord Bots:\n${error}`)
          reject(error)
        } else {
          resolve(response)
        }
      })
    }
  })
}

function postStats (content, bot) {
  return new Promise(function (resolve, reject) {
    if (!Config.stats.dbots.enabled) {
      resolve(`Discord Bots functions have been turned off. Enable them in the config to use this command.`)
    } else {
      request
      .post(`${baseUrl}/bots/${botId}/stats`)
      .set(`Authorization`, `${token}`)
      .send({ "server_count": content }) // eslint-disable-line quotes
      .end(function (error, response) {
        if (error) {
          pushAdminLog(`An error occurred while posting my server count. Check console for details.`, bot)
          logger.error(`Error while getting bot info from Discord Bots:\n${error}`)
          reject(error)
        } else {
          logger.info(`Successfully posted server count to Discord Bots. Posted info: ${content}`)
        }
      })
    }
  })
}

function getStats (bot) {
  return new Promise(function (resolve, reject) {
    if (!Config.stats.dbots.enabled) {
      resolve(`Discord Bots functions have been turned off. Enable them in the config to use this command.`)
    } else {
      request
      .get(`${baseUrl}/bots/${botId}/stats`)
      .set(`Authorization`, `${token}`)
      .end(function (error, response) {
        if (error) {
          pushAdminLog(`An error occurred while getting my stats. Check console for details.`, bot)
          logger.error(`Error while getting bot info from Discord Bots:\n${error}`)
          reject(error)
        } else {
          resolve(response)
        }
      })
    }
  })
}

export { getBotInfo, postStats, getStats }
