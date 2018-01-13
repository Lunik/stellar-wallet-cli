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
        printAccount(data).then(resolve).catch(reject)
      }
    })
  })
}

function printAccount (account) {
  return new Promise((resolve, reject) => {
    stellarApi.loadAccount(account.publicKey).then((account) => {
      console.log(`
        ${chalk.green.bold('Public key')}: ${account.account_id}
        ${chalk.green.bold('Inflation')}: ${account.inflation_destination}
        ${chalk.green.bold('Sequence')}: ${account.sequence}
        ${chalk.green.bold('Balances:')}\
      `)
      let total = 0.0
      for (let balance of account.balances) {
        total += parseFloat(balance.balance)
        console.log(`\
          - ${chalk.bold(balance.asset_type)}: ${chalk.yellow(balance.balance)} lumens\
        `)
      }
      console.log(`
        ${chalk.green.bold('Total')}: ${chalk.yellow.bold(total)} lumens
      `)
      resolve()
    }).catch((err) => {
      if (err) {}
      console.log(`
        Public key: ${account.publicKey}
        ${chalk.red.bold(`Account doesn't exist yet, send ${process.env.MIN_BALANCE} lumens to create`)}
      `)
      resolve()
    })
  })
}
