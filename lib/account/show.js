const chalk = require('chalk')
const fs = require('fs')
const stellar = require('stellar-sdk')

if (process.env.NET === 'public') {
  stellar.Network.usePublicNetwork
} else {
  stellar.Network.useTestNetwork()
}
const stellarServer = new stellar.Server(process.env.NET_SERVER)

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
    loadAccount(account.publicKey).then((account) => {
      console.log(`\nPublic key: ${account.account_id}`)
      console.log(chalk.green.bold('Balances:'))
      let total = 0.0
      for (let balance of account.balances) {
        total += parseFloat(balance.balance)
        console.log(`  - ${chalk.bold(balance.asset_type)}: ${chalk.yellow(balance.balance)} lumens`)
      }
      console.log(`\n${chalk.green.bold('Total')}: ${chalk.yellow.bold(total)} lumens`)
      console.log('')
      resolve()
    }).catch((err) => {
      console.log(`
        Public key: ${account.publicKey}
        ${chalk.red.bold(`Account doesn\'t exist yet, send ${process.env.MIN_BALANCE} lumens to create`)}
      `)
      resolve()
    })
  })
}

function loadAccount (publicKey) {
  return new Promise((resolve, reject) => {
    stellarServer.accounts()
      .accountId(publicKey)
      .call()
      .then(resolve)
      .catch(reject)
  })
}