const chalk = require('chalk')
const fs = require('fs')
const stellar = require('stellar-sdk')
const inquirer = require('inquirer')
const CryptoJS = require('crypto-js')

module.exports = Delete

function Delete () {
  return new Promise((resolve, reject) => {
    verifyExist().then(() => {
      askDelete().then((response) => {
        if (response) {
          console.log(chalk.red.bold('Your account have been deleted'))
          fs.unlink(process.env['ACCOUNT_FILE'], (err) => {
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

const overwriteChoices = [{
  name: 'No',
  value: false,
  short: 'no'
}, {
  name: 'Yes',
  value: true,
  short: 'yes'
}]

const overwriteQuestion = {
  type: 'list',
  name: 'response',
  message: `An account already exist. Do you want to overwrite it ${chalk.bold.green('?')}`,
  choices: overwriteChoices,
  default: 'no',
  prefix: chalk.cyan('[ Creation ]')
}

function verifyExist () {
  return new Promise((resolve, reject) => {
    fs.access(process.env['ACCOUNT_FILE'], fs.constants.F_OK, (err) => {
      // Error == File doesn't exist
      // No Error == File exist
      if (!err) {
        resolve()
      } else {
        inquirer.prompt(overwriteQuestion).then((response) => {
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

const DeleteChoices = [{
  name: 'No',
  value: false,
  short: 'no'
}, {
  name: 'Yes',
  value: true,
  short: 'yes'
}]

const deleteQuestion = {
  type: 'list',
  name: 'response',
  message: `Delete current account ${chalk.bold.green('?')}`,
  choices: overwriteChoices,
  default: 'no',
  prefix: chalk.cyan('[ Deletion ]')
}

function askDelete () {
  return new Promise((resolve, reject) => {
    inquirer.prompt(deleteQuestion).then((response) => {
      resolve(response.response)
    }).catch(reject)
  })
}