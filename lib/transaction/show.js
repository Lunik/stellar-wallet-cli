const chalk = require('chalk')
const fs = require('fs')

const prompter = require('../other/prompter')
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
        stellarApi.loadTransactions(data.publicKey).then((transactions) => {
          askTransaction(transactions).then((transaction) => {
            printTransaction(transaction)
            resolve()
          })
        })
      }
    })
  })
}

function askTransaction (transactions) {
  let choices = transactions.map((tr) => {
    return {
      name: `${formatDate(tr.metadata.created_at)}: ${tr.metadata.hash.slice(0, 20)}`,
      value: tr.metadata.hash
    }
  })

  const transactionQuestion = {
    type: 'list',
    name: 'hash',
    message: `Choose transaction`,
    choices: choices,
    prefix: chalk.cyan('[ Transaction ]'),
    suffix: chalk.green.bold(' $')
  }

  return new Promise((resolve, reject) => {
    prompter(transactionQuestion).then((response) => {
      let transaction = transactions.find((e) => e.metadata.hash === response.hash)
      resolve(transaction)
    }).catch(reject)
  })
}

function printTransaction (transaction) {
  console.log(`
  ${chalk.green.bold('Date')}: ${formatDate(transaction.metadata.created_at)}
  ${chalk.green.bold('TxHash')}: ${transaction.metadata.hash}
  ${chalk.green.bold('Fees')}: ${parseFloat(transaction.metadata.fee_paid) / stellarApi.moneyFactor()} lumens
  ${chalk.green.bold('Source')}: ${transaction.metadata.source_account}
  ${chalk.green.bold('Operations')}:\n${transaction.envelope.operations.map((operation) => formatOperation(operation)).join('\n')}
  `)
}

function formatOperation (operation) {
  switch (operation.type) {
    case 'payment':
      return `\
   -  ${chalk.green.bold('Type')}: ${operation.type}
      ${chalk.green.bold('Destination')}: ${operation.destination}
      ${chalk.green.bold('Amount')}: ${parseFloat(operation.amount)} lumens\
      `
    case 'createAccount':
      return `\
   -  ${chalk.green.bold('Type')}: ${operation.type}
      ${chalk.green.bold('Destination')}: ${operation.destination}
      ${chalk.green.bold('Starting balance')}: ${parseFloat(operation.startingBalance)} lumens\
      `
    case 'accountMerge':
      return `\
   -  ${chalk.green.bold('Type')}: ${operation.type}
      ${chalk.green.bold('Destination')}: ${operation.destination}\
      `
    case 'setOptions':
      const options = [{
        text: 'Inflation destination',
        attribute: 'inflationDest'
      }, {
        text: 'Clear flags',
        attribute: 'clearFlags'
      }, {
        text: 'Set flags',
        attribute: 'setFlags'
      }, {
        text: 'Master weight',
        attribute: 'masterWeight'
      }, {
        text: 'Low thresold',
        attribute: 'lowThreshold'
      }, {
        text: 'Medium thresold',
        attribute: 'medThreshold'
      }, {
        text: 'High thresold',
        attribute: 'highThreshold'
      }, {
        text: 'Home domain',
        attribute: 'homeDomain'
      }, {
        text: 'Signer',
        attribute: 'signer'
      }]
      let attributes = options.map((option) => {
        if (operation[option.attribute]) {
          return chalk.green.bold(option.text) + ': ' + operation[option.attribute]
        } else {
          return null
        }
      }).filter((e) => e !== null)
      return `\
   -  ${chalk.green.bold('Type')}: ${operation.type}
      ${attributes.join('\n')}\
      `
    default:
      return `\
   -  ${chalk.green.bold('Type')}: ${operation.type}
      `
  }
}

function formatDate (date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}
