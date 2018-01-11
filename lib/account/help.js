const chalk = require('chalk')

module.exports = Help

const modules = {
  'help': 'Show information about options',
  'show': 'Show account informations',
  'show-secret': 'Show account secrets informations',
  'create': 'Create new account',
  'import': 'Import existing account',
  'delete': 'Delete current account',
  'end': 'Return to the previous menu'
}

function Help (module) {
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