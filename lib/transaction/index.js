const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')

module.exports = Account

const choices = [{
  name: 'Help',
  value: 'help',
  short: 'help'
}, {
  name: 'Show',
  value: 'show',
  short: 'show'
}]

const optionQuestion = {
  type: process.env.QUESTION_FORMAT,
  name: 'option',
  message: chalk.bold.green('$'),
  choices: choices,
  default: 'help',
  prefix: chalk.cyan('[ Transaction ]'),
  validate: (value) => {
    for (c of choices) {
      if (c.value === value) return true
    }
    return false
  }
}

function Account () {
  return new Promise((resolve, reject) => {
    inquirer.prompt(optionQuestion).then((response) => {
      switch (response.option) {
        case 'help':
          let module = response.option
          require(`./${module}`)().then(() => Account().then(resolve).catch(reject)).catch(console.error)
          break
        case 'end':
          resolve()
      }
    }).catch(reject)
  })
}