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

  moneyFactor () {
    return 10000000
  }

  loadAccount (publicKey) {
    return new Promise((resolve, reject) => {
      if (!publicKey) {
        reject(Error('Empty publicKey'))
        return
      }
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

  existAccount (publicKey) {
    return new Promise((resolve, reject) => {
      if (!publicKey) {
        reject(Error('Empty publicKey'))
        return
      }
      this.loadAccount(publicKey).then(() => resolve(true)).catch(() => resolve(false))
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
      let load = new Loading('Sending operation')
      const keypair = this.keypairFromSecret(secretKey)

      this.loadAccount(keypair.publicKey()).then((account) => {
        load.start()

        let operation = StellarSdk.Operation.setOptions({
          inflationDest: inflation
        })

        let transaction = new StellarSdk.TransactionBuilder(account)
          .addOperation(operation)
          .build()

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

  send (secretKey, destination, amout, memo) {
    return new Promise((resolve, reject) => {
      let load = new Loading('Sending operation')
      const keypair = this.keypairFromSecret(secretKey)

      this.loadAccount(keypair.publicKey()).then((account) => {
        load.start()

        let operation = StellarSdk.Operation.payment({
          destination: destination,
          amount: amout,
          asset: StellarSdk.Asset.native()
        })

        let memoObj = new StellarSdk.Memo(getMemoFromString(memo.type), memo.value)

        let transaction = new StellarSdk.TransactionBuilder(account)
          .addOperation(operation)
          .addMemo(memoObj)
          .build()

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

  loadTransactions (publicKey) {
    let load = new Loading('Loading transactions')
    return new Promise((resolve, reject) => {
      load.start()
      var transactions = []
      this.stellarServer.transactions()
        .forAccount(publicKey)
        .order('desc')
        .call().then((tr) => {
          for (let transaction of tr.records) {
            transactions.push({
              metadata: transaction,
              envelope: new StellarSdk.Transaction(transaction.envelope_xdr)
            })
          }
          load.stop()
          resolve(transactions)
        }).catch((data) => {
          load.stop()
          reject(data)
        })
    })
  }
}

module.exports = API

function getMemoFromString (string) {
  switch (string) {
    case 'MemoText':
      return StellarSdk.MemoText
    case 'MemoID':
      return StellarSdk.MemoID
    case 'MemoHash':
      return StellarSdk.MemoHash
    case 'MemoReturn':
      return StellarSdk.MemoReturn
    case 'MemoNone':
    default:
      return StellarSdk.MemoNone
  }
}
