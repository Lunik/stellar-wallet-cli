const chalk = require('chalk')

module.exports = Help

const modules = {
  'help': 'Show information about options',
  'account': 'Manage your stellar account',
  'transaction': 'Manage account transactions',
  'exit': 'Exit the utility'
}

function Help () {
  return new Promise((resolve, reject) => {
    try {
      console.log('')
      for (let module in modules) {
        console.log(chalk.green(module), '\t', modules[module])
      }
      console.log('')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
