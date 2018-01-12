const chalk = require('chalk')

const Prompter = require('./other/prompter')

module.exports = Menu

const choices = ['help', 'account', 'transaction', 'exit']

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
        let module = response.option
        require(`./${module}`)().then(Menu).catch(console.error)
        break
      case 'exit':
        process.exit(1)
      default:
        require(`./help`)().then(Menu).catch(console.error)
    }
  }).catch(console.error)
}
