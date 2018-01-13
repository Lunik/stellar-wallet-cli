const chalk = require('chalk')
const fs = require('fs')
const CryptoJS = require('crypto-js')

const prompter = require('../other/prompter')
const API = require('../other/api')

const stellarApi = new API()

module.exports = Inflation

function Inflation () {
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
        askInflation().then((inflation) => {
          stellarApi.existAccount(inflation).then((exist) => {
            if (!exist) {
              console.log(chalk.red.bold('Inflation destination does not exist'))
              resolve()
            } else {
              askPassword(data.secretKey).then((secretKey) => {
                stellarApi.setInflation(secretKey, inflation).then((transaction) => {
                  console.log(chalk.bold.green('Inflation destination changed with success'))
                  console.log(`${chalk.green.bold('TxHash')}: ${transaction.hash}`)
                  resolve()
                }).catch((err) => {
                  if (err instanceof Error) {
                    console.log(chalk.bold.red('Invalid inflation destination'))
                  } else {
                    console.log(chalk.red.bold('Transaction rejected'))
                  }
                  resolve()
                })
              }).catch(resolve)
            }
          })
        }).catch(reject)
      }
    })
  })
}

//
//  Inflation
//

const inflationQuestion = {
  type: 'input',
  name: 'inflationPool',
  message: `Enter inflation pool address`,
  validate: verifyAddres,
  prefix: chalk.cyan('[ Inflation ]'),
  suffix: chalk.green.bold(' $')
}

function askInflation () {
  return new Promise((resolve, reject) => {
    prompter(inflationQuestion).then((response) => {
      resolve(response.inflationPool)
    }).catch(reject)
  })
}

function verifyAddres (value) {
  if (!value || value[0] !== 'G') {
    console.log('\n', chalk.bold.red('This is not a public key'))
    return false
  }
  return true
}

//
//  unlock secret
//
const passwordQuestion = {
  type: 'password',
  name: 'password',
  message: `Account password`,
  prefix: chalk.cyan('[ Inflation ]'),
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
