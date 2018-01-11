const inquirer = require('inquirer')
const chalk = require('chalk')

module.exports = Menu

const choices = [{
  name: 'Help',
  value: 'help',
  short: 'help'
}, {
  name: 'Account',
  value: 'account',
  short: 'account'
}, {
  name: 'Transaction',
  value: 'transaction',
  short: 'transaction'
}, {
  name: 'Exit',
  value: 'exit',
  short: 'exit'
}]

const optionQuestion = {
  type: process.env.QUESTION_FORMAT,
  name: 'option',
  message: chalk.bold.green('$'),
  choices: choices,
  default: 'help',
  prefix: chalk.cyan('[ Menu ]'),
  validate: (value) => {
    for (c of choices) {
      if (c.value === value) return true
    }
    return false
  }
}

function Menu () {
  inquirer.prompt(optionQuestion).then((response) => {
    switch (response.option) {
      case 'help':
      case 'account':
      case 'transaction':
        let module = response.option
        require(`./${module}`)().then(Menu).catch(console.error)
        break
      case 'exit':
        process.exit(1)
    }
  }).catch(console.error)
}