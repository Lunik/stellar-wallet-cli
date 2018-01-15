const chalk = require('chalk')

module.exports = Help

const modules = {
  'help': '\t Show information about options',
  'show': '\t Show account informations',
  'show-secret': 'Show account secrets informations',
  'inflation': 'Modify inflation pool',
  'create': '\t Create new account',
  'import': '\t Import existing account',
  'delete': '\t Delete current account',
  'end': '\t Return to the previous menu'
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
