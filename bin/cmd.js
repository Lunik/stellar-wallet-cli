#! /usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser
const fs = require('fs')
const os = require('os')
const path = require('path')

const StellarLogo = require('../static/stellarIcon')
const Menu = require('../lib/menu')

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
})

var args = parser.parseArgs()

console.log(StellarLogo)

CreateAppDir()
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