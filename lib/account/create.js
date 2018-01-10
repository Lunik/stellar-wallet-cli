const chalk = require('chalk')
const fs = require('fs')
const stellar = require('stellar-sdk')
const inquirer = require('inquirer')
const CryptoJS = require('crypto-js')

module.exports = Create

function Create () {
  return new Promise((resolve, reject) => {
    Generate().then((keypair) => {
      askPassword().then((password) => {
        resolve()
        let accountData = {
          type: keypair.type,
          publicKey: keypair.publicKey(),
          secretKey: CryptoJS.AES.encrypt(keypair.secret(), password).toString()
        }

        fs.writeFile(process.env['ACCOUNT_FILE'], JSON.stringify(accountData), 'utf8', (err) => {
          if (err) {
            reject(err)
          }
        })
      })
    }).catch(reject)
  })
}

const generateChoices = [{
  name: 'Regenerate',
  value: false,
  short: 'no'
}, {
  name: 'Yes',
  value: true,
  short: 'yes'
}]

const generateQuestion = {
  type: 'list',
  name: 'response',
  message: `Is this account OK ${chalk.bold.green('?')}`,
  choices: generateChoices,
  default: 'no',
  prefix: chalk.cyan('[ Creation ]')
}

function Generate () {
  let keypair = stellar.Keypair.random()

  return new Promise((resolve, reject) => {
    console.log(`
    ${chalk.bold.red('MAKE SURE THAT NOBODY IS WHATCHING !')}
    Generated account.
    Public key: ${keypair.publicKey()}
    Secret key: ${keypair.secret()}
    `)
    inquirer.prompt(generateQuestion).then((response) => {
      if (response.response) {
        resolve(keypair)
      } else {
        Generate().then(resolve).catch(reject)
      }
    }).catch(reject)
  })
}

function askPassword () {
  return new Promise((resolve, reject) => {
    resolve("TODO")
  })
}