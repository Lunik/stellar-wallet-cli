const chalk = require('chalk')

module.exports = Help

const modules = {
  'help': 'Show information about options',
  'end': 'Return to the previous menu'
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
