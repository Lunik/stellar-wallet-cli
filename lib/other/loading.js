const inquirer = require('inquirer')

class Loading {
  constructor (text, time) {
    this.text = text
    this.interval = null
    this.i = 0
    this.time = time || 500
    this.ui = new inquirer.ui.BottomBar()
  }

  animation () {
    this.i = (this.i + 1) % 4

    let dots = new Array(this.i + 1).join('.')
    this.ui.updateBottomBar(this.text + dots)
  }

  start () {
    this.animation()
    this.interval = setInterval(() => this.animation(), this.time)
  }

  stop () {
    clearInterval(this.interval)
    this.ui.updateBottomBar('')
  }
}

module.exports = Loading
