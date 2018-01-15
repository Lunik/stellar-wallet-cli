const chalk = require('chalk')

const Prompter = require('./other/prompter')
const Modules = {
  'help': require('./help'),
  'account': require('./account'),
  'transaction': require('./transaction'),
  'about': require('./about'),
}

module.exports = Menu

const choices = ['help', 'account', 'transaction', 'about', 'exit']

const optionQuestion = {
  type: process.env.QUESTION_FORMAT,
  name: 'option',
  message: chalk.bold.green('$'),
  choices: choices,
  default: 'help',
  context: 'menu',
  prefix: chalk.cyan('[ Menu ]'),
  validate: (value) => {
    return choices.indexOf(value) !== -1
  }
}

function Menu () {
  Prompter(optionQuestion).then((response) => {
    switch (response.option) {
      case 'help':
      case 'account':
      case 'transaction':
      case 'about':
        let module = response.option
        Modules[module]().then(Menu).catch(console.error)
        break
      case 'exit':
        process.exit(1)
      default:
        Modules['help']().then(Menu).catch(console.error)
    }
  }).catch(console.error)
}
