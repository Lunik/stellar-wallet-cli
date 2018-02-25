const chalk = require('chalk')
const fs = require('fs')
const CryptoJS = require('crypto-js')

const prompter = require('../other/prompter')
const API = require('../other/api')

const stellarApi = new API()

module.exports = Send

function Send () {
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
        askDestination().then((destination) => {
          stellarApi.existAccount(destination).then((exist) => {
            if (!exist) {
              console.log(chalk.red.bold('Destination address does not exist'))
              resolve()
            } else {
              askAmount().then((amout) => {
                askMemo().then((memo) => {
                  showTransaction(destination, amout, memo)
                  askConfirm().then((confirm) => {
                    if (confirm) {
                      askPassword(data.secretKey).then((secretKey) => {
                        stellarApi.send(secretKey, destination, amout, memo).then((transaction) => {
                          console.log(chalk.bold.green('Lumens sent with success'))
                          console.log(`${chalk.green.bold('TxHash')}: ${transaction.hash}`)
                          resolve()
                        }).catch((err) => {
                          console.log(err)
                          console.log(chalk.red.bold('Transaction rejected'))
                          resolve()
                        })
                      }).catch(resolve)
                    } else {
                      console.log(chalk.red.bold('Transaction canceled'))
                      resolve()
                    }
                  })
                })
              }).catch(reject)
            }
          })
        }).catch(reject)
      }
    })
  })
}

function showTransaction (destination, amout, memo) {
  console.log(`
    ${chalk.green.bold('Destionation')}: ${destination}
    ${chalk.green.bold('Amout')}: ${amout} lumens
    ${chalk.green.bold('Memo')}: ${memo.type} ${memo.type === 'MemoNone' ? '' : '= ' + memo.value}
  `)
}

//
//  Destination
//

const destinationQuestion = {
  type: 'input',
  name: 'destinationPool',
  message: `Enter destination address`,
  validate: verifyAddres,
  prefix: chalk.cyan('[ Send ]'),
  suffix: chalk.green.bold(' $')
}

function askDestination () {
  return new Promise((resolve, reject) => {
    prompter(destinationQuestion).then((response) => {
      resolve(response.destinationPool)
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
//  Amout
//

const amoutQuestion = {
  type: 'input',
  name: 'amount',
  message: `Enter amount (lumens)`,
  validate: verifyAmount,
  prefix: chalk.cyan('[ Send ]'),
  suffix: chalk.green.bold(' $')
}

function askAmount () {
  return new Promise((resolve, reject) => {
    prompter(amoutQuestion).then((response) => {
      resolve(response.amount)
    }).catch(reject)
  })
}

function verifyAmount (value) {
  let amount = parseFloat(value)

  if (Number.isNaN(amount)) {
    console.log(chalk.red.bold(` ${amount} is not a number`))
    return false
  }

  if (amount < 0) {
    console.log(chalk.red.bold(' Amount should be superior to 0'))
    return false
  }

  return true
}

//
//  Amout
//

const memoTypeQuestion = {
  type: 'list',
  name: 'memoType',
  message: `Choose memo type`,
  choices: ['MemoText', 'MemoNone', 'MemoID', 'MemoHash', 'MemoReturn'],
  default: 'MemoNone',
  prefix: chalk.cyan('[ Send ]'),
  suffix: chalk.green.bold(' $')
}

const memoQuestion = {
  type: 'input',
  name: 'memo',
  message: `Enter memo`,
  prefix: chalk.cyan('[ Send ]'),
  suffix: chalk.green.bold(' $')
}

function askMemo () {
  return new Promise((resolve, reject) => {
    prompter(memoTypeQuestion).then((response) => {
      let memoType = response.memoType
      if (memoType !== 'MemoNone') {
        prompter(memoQuestion).then((response) => {
          resolve({
            type: memoType,
            value: response.memo
          })
        }).catch(reject)
      } else {
        resolve({
          type: memoType,
          value: null
        })
      }
    }).catch(reject)
  })
}

//
//  Confirm
//

const confirmQuestion = {
  type: 'confirm',
  name: 'confirm',
  message: `Is this transaction OK`,
  prefix: chalk.cyan('[ Send ]'),
  suffix: chalk.green.bold(' ?')
}

function askConfirm () {
  return new Promise((resolve, reject) => {
    prompter(confirmQuestion).then((response) => {
      resolve(response.confirm)
    }).catch(reject)
  })
}

//
//  unlock secret
//
const passwordQuestion = {
  type: 'password',
  name: 'password',
  message: `Account password`,
  prefix: chalk.cyan('[ Send ]'),
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
