const chalk = require('chalk')
const fs = require('fs')

const API = require('../other/api')

const stellarApi = new API()

module.exports = Show

function Show () {
  return new Promise((resolve, reject) => {
    fs.readFile(process.env.ACCOUNT_FILE, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(
            chalk.yellow('[ Warning ]'),
            'You don\'t have account yet.',
            'Use', chalk.green('create'),
            'or', chalk.green('import'),
            'first.'
          )
          resolve()
        } else {
          reject(err)
        }
      } else {
        data = JSON.parse(data)
        console.log(`
          ${chalk.green.bold('Send lumens to this address')}:
          ${data.publicKey}
        `)
      }
    })
  })
}