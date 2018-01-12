const inquirer = require('inquirer')
const customInput = require('./customInput')

inquirer.registerPrompt('command', customInput)

function Prompter (question) {
  if (question.type === 'command') {
    question.autoCompletion = question.choices
  }
  return inquirer.prompt(question)
}

module.exports = Prompter
