#! /usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser
const fs = require('fs')
const os = require('os')
const path = require('path')

const StellarLogo = require('../static/stellarIcon')

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
})

parser.addArgument(['--question', '-q'], {
  help: 'Format of questions. input or list',
  defaultValue: 'input',
  choices: ['input', 'list'],
  dest: 'question_format'
})

var args = parser.parseArgs()

console.log(StellarLogo)

CreateAppDir()
Initialise(args)

const Menu = require('../lib/menu')
Menu()

function CreateAppDir () {
  const home = path.join(os.homedir(), '.stellarWallet')
  process.env['HOME'] = home

  try {
    fs.mkdirSync(home)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw Error(`Cannot create App Directory in ${home}`)
    }
  }
}

function Initialise (args) {
  process.env['QUESTION_FORMAT'] = args.question_format
  process.env['NET'] = 'public' //'test' // or public
  process.env['NET_SERVER'] = 'https://horizon.stellar.org' //'https://horizon-testnet.stellar.org' //horizon.stellar.org
  process.env['MIN_BALANCE'] = 20
  process.env['ACCOUNT_FILE'] = path.join(process.env['HOME'], 'account.txt')
}