const chalk = require('chalk')
const fs = require('fs')
const stellar = require('stellar-sdk')

const Loading = require('../other/loading')

if (process.env.NET === 'public') {
  stellar.Network.usePublicNetwork()
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
        printTransaction(data).then(resolve).catch(reject)
      }
    })
  })
}

function printTransaction (account) {
  return new Promise((resolve, reject) => {
    loadAccount(account.publicKey).then((account) => {
      console.log(`
        ${chalk.green.bold('Public key')}: ${account.account_id}
      `)
      account.transactions().then((tr) => {
        console.log(tr._embedded)
      })
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

function loadAccount (publicKey) {
  return new Promise((resolve, reject) => {
    let load = new Loading('Retrieving data')
    load.start()
    stellarServer.accounts()
      .accountId(publicKey)
      .call()
      .then((data) => {
        load.stop()
        resolve(data)
      })
      .catch((data) => {
        load.stop()
        reject(data)
      })
  })
}
