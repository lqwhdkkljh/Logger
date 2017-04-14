import fs from 'fs'
import { logger } from '../engine/logger'

function fileExists (path) {
  try {
    fs.statSync(path)
  } catch (err) {
    logger.error(`Internal file '${path}' not found, please verify it exists and restart.`)
    process.exit()
  }
}

export { fileExists }
