const chalk = require('chalk')
const fs = require('fs')
const CryptoJS = require('crypto-js')

const prompter = require('../other/prompter')

module.exports = ShowSecret

function ShowSecret () {
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
        printSecret(data).then(resolve).catch(reject)
      }
    })
  })
}

function printSecret (account) {
  return new Promise((resolve, reject) => {
    askPassword(account.secretKey).then((secretKey) => {
      console.log(`
      ${chalk.bold.red('MAKE SURE THAT NOBODY IS WHATCHING !')}
      Secret key: ${secretKey}
      `)
      resolve()
    }).catch(resolve)
  })
}

const passwordQuestion = {
  type: 'password',
  name: 'password',
  message: `Account password`,
  prefix: chalk.cyan('[ ShowSecret ]'),
  suffix: chalk.green.bold(' $')
}

function askPassword (cipherSecretKey) {
  return new Promise((resolve, reject) => {
    prompter(passwordQuestion).then((response) => {
      try {
        let secretKey = CryptoJS.AES.decrypt(cipherSecretKey, response.password).toString(CryptoJS.enc.Utf8)
        if (!secretKey) {
          throw Error('Empty password')
        }
        resolve(secretKey)
      } catch (error) {
        console.log(chalk.red.bold('Wrong password'))
        reject(error)
      }
    }).catch(reject)
  })
}
