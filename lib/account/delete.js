const chalk = require('chalk')
const fs = require('fs')
const stellar = require('stellar-sdk')
const CryptoJS = require('crypto-js')

const prompter = require('../other/prompter')

module.exports = Delete

function Delete () {
  return new Promise((resolve, reject) => {
    verifyExist().then(() => {
      askDelete().then((response) => {
        if (response) {
          console.log(chalk.red.bold('Your account have been deleted'))
          fs.unlink(process.env.ACCOUNT_FILE, (err) => {
            if (err) {
              reject(err)
            }
          })
        }
        resolve()
      }).catch(reject)
    }).catch(resolve)
  })
}

//
// Verify exist
//

const overwriteQuestion = {
  type: 'confirm',
  name: 'response',
  message: `An account already exist. Do you want to overwrite it ${chalk.bold.green('?')}`,
  default: false,
  prefix: chalk.cyan('[ Deletion ]')
}

function verifyExist () {
  return new Promise((resolve, reject) => {
    fs.access(process.env.ACCOUNT_FILE, fs.constants.F_OK, (err) => {
      // Error == File doesn't exist
      // No Error == File exist
      if (!err) {
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

//
// Delete account
//

const deleteQuestion = {
  type: 'confirm',
  name: 'response',
  message: `Delete current account ${chalk.bold.green('?')}`,
  default: false,
  prefix: chalk.cyan('[ Deletion ]')
}

function askDelete () {
  return new Promise((resolve, reject) => {
    prompter(deleteQuestion).then((response) => {
      resolve(response.response)
    }).catch(reject)
  })
}
