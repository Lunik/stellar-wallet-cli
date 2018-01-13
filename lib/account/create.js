const chalk = require('chalk')
const fs = require('fs')
const CryptoJS = require('crypto-js')

const prompter = require('../other/prompter')
const API = require('../other/api')

const stellarApi = new API()

module.exports = Create

function Create () {
  return new Promise((resolve, reject) => {
    verifyExist().then(() => {
      generate().then((keypair) => {
        askPassword().then((password) => {
          console.log(chalk.green.bold('Account successfully created'))
          resolve()
          let accountData = {
            type: keypair.type,
            publicKey: keypair.publicKey(),
            secretKey: CryptoJS.AES.encrypt(keypair.secret(), password).toString()
          }

          fs.writeFile(process.env.ACCOUNT_FILE, JSON.stringify(accountData), 'utf8', (err) => {
            if (err) {
              reject(err)
            }
          })
        })
      }).catch(reject)
    }).catch(resolve)
  })
}

//
//  Generating account
//
const generateQuestion = {
  type: 'confirm',
  name: 'response',
  message: `Is this account OK (no -> regenerate) ${chalk.bold.green('?')}`,
  default: true,
  prefix: chalk.cyan('[ Creation ]')
}

function generate () {
  let keypair = stellarApi.generateAccount()

  return new Promise((resolve, reject) => {
    console.log(`
    ${chalk.bold.red('MAKE SURE THAT NOBODY IS WHATCHING !')}
    Generated account.
    Public key: ${keypair.publicKey()}
    Secret key: ${keypair.secret().replace(/./g, '*')}
    `)
    prompter(generateQuestion).then((response) => {
      if (response.response) {
        resolve(keypair)
      } else {
        generate().then(resolve).catch(reject)
      }
    }).catch(reject)
  })
}

//
//  Ask for password
//
const passwordQuestion = [{
  type: 'password',
  name: 'password',
  message: `Choose a password to secure your secret informations`,
  prefix: chalk.cyan('[ Creation ]'),
  suffix: ` ${chalk.green.bold('$')} (8 char minimum)`,
  validate: verifyPassword
}, {
  type: 'password',
  name: 'password2',
  message: `Repeate password`,
  prefix: chalk.cyan('[ Creation ]'),
  suffix: ` ${chalk.green.bold('$')} (8 char minimum)`,
  validate: verifyPassword
}]

function askPassword () {
  return new Promise((resolve, reject) => {
    prompter(passwordQuestion).then((response) => {
      if (response.password === response.password2) {
        resolve(response.password)
      } else {
        console.log(chalk.red.bold('Passwords missmatch'))
        askPassword().then(resolve).catch(reject)
      }
    }).catch(reject)
  })
}

function verifyPassword (pass) {
  if (pass.length < 8) {
    console.log('\n', chalk.red.bold('Password is too short'))
    return false
  }
  return true
}

//
//  Verify if account already exist
//

const overwriteQuestion = {
  type: 'confirm',
  name: 'response',
  message: `An account already exist. Do you want to overwrite it ${chalk.bold.green('?')}`,
  default: false,
  prefix: chalk.cyan('[ Creation ]')
}

function verifyExist () {
  return new Promise((resolve, reject) => {
    fs.access(process.env.ACCOUNT_FILE, fs.constants.F_OK, (err) => {
      // Error == File doesn't exist
      // No Error == File exist
      if (err) {
        resolve()
      } else {
        prompter(overwriteQuestion).then((response) => {
          if (response.response) {
            resolve()
          } else {
            reject()
          }
        })
      }
    })
  })
}
