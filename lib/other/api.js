const StellarSdk = require('stellar-sdk')

const Loading = require('./loading')

class API {
  constructor () {
    if (process.env.NET === 'public') {
      StellarSdk.Network.usePublicNetwork()
    } else {
      StellarSdk.Network.useTestNetwork()
    }
    this.stellarServer = new StellarSdk.Server(process.env.NET_SERVER)
  }

  loadAccount (publicKey) {
    return new Promise((resolve, reject) => {
      let load = new Loading('Retrieving data')
      load.start()
      this.stellarServer.loadAccount(publicKey)
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

  generateAccount () {
    return StellarSdk.Keypair.random()
  }

  keypairFromSecret (secret) {
    return StellarSdk.Keypair.fromSecret(secret)
  }

  setInflation (secretKey, inflation) {
    return new Promise((resolve, reject) => {
      let load = new Loading('Sending transaction')
      const keypair = this.keypairFromSecret(secretKey)

      this.loadAccount(keypair.publicKey()).then((account) => {
        load.start()
        let operation = StellarSdk.Operation.setOptions({
          inflationDest: inflation
        })

        let transaction = new StellarSdk.TransactionBuilder(account).addOperation(operation).build()

        transaction.sign(keypair)

        this.stellarServer.submitTransaction(transaction).then((data) => {
          load.stop()
          resolve(data)
        }).catch((data) => {
          load.stop()
          reject(data)
        })
      }).catch((data) => {
        load.stop()
        reject(data)
      })
    })
  }
}

module.exports = API
