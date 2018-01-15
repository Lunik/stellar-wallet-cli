const chalk = require('chalk')
const package = require('../package.json')

module.exports = `
\t${chalk.blue.bold('Stellar-Wallet-CLI')}
\t${chalk.green.bold('Version')}: ${package.version}
\t
\t${chalk.green.bold('Developped by')}: ${package.author}
\t${chalk.green.bold('Source')}: ${package.repository.url}
\t
\t${chalk.green.bold('Donation')} : GC3KNPW3WV23RCTZDY23OJJB4D36ZPO5R3LCIEX2VMUJX7HSGUW3CBR5
`
