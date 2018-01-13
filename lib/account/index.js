const chalk = require('chalk')
const path = require('path')

const prompter = require('../other/prompter')

module.exports = Account

const choices = ['help', 'show', 'show-secret', 'inflation', 'create', 'import', 'delete', 'end']

const optionQuestion = {
  type: process.env.QUESTION_FORMAT,
  name: 'option',
  message: chalk.bold.green('$'),
  choices: choices,
  default: 'help',
  prefix: chalk.cyan('[ Account ]'),
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
        case 'show-secret':
        case 'import':
        case 'inflation':
        case 'create':
        case 'delete':
          let module = response.option
          require(`./${module}`)().then(() => Account().then(resolve).catch(reject)).catch(console.error)
          break
        case 'end':
          resolve()
      }
    }).catch(reject)
  })
}
