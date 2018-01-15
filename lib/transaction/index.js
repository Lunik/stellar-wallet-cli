const chalk = require('chalk')
const path = require('path')

const prompter = require('../other/prompter')
const Modules = {
  'help': require('./help'),
  'show': require('./show'),
  'receiv': require('./receiv'),
  'send': require('./send')
}

module.exports = Account

const choices = ['help', 'show', 'send', 'receiv', 'end']

const optionQuestion = {
  type: process.env.QUESTION_FORMAT,
  name: 'option',
  message: chalk.bold.green('$'),
  choices: choices,
  default: 'help',
  context: 'transaction',
  prefix: chalk.cyan('[ Transaction ]'),
  validate: (value) => {
    return choices.indexOf(value) !== -1
  }
}

function Account () {
  return new Promise((resolve, reject) => {
    prompter(optionQuestion).then((response) => {
      switch (response.option) {
        case 'help':
        case 'show':
        case 'send':
        case 'receiv':
          let module = response.option
          Modules[module]().then(() => Account().then(resolve).catch(reject)).catch(console.error)
          break
        case 'end':
          resolve()
      }
    }).catch(reject)
  })
}
