const chalk = require('chalk')
const path = require('path')

const prompter = require('../other/prompter')

module.exports = Account

const choices = ['help', 'show', 'receiv', 'end']

const optionQuestion = {
  type: process.env.QUESTION_FORMAT,
  name: 'option',
  message: chalk.bold.green('$'),
  choices: choices,
  default: 'help',
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
        case 'receiv':
          let module = response.option
          require(`./${module}`)().then(() => Account().then(resolve).catch(reject)).catch(console.error)
          break
        case 'end':
          resolve()
      }
    }).catch(reject)
  })
}
