import fs from 'fs'

function fileExists(path) {
  try {
    fs.statSync(path)
  } catch (err) {
    console.log('Internal file ' + path + ' not found, please verify it exists and restart.')
    process.exit()
  }
}

export { fileExists }
