const keypress = require('keypress')

module.exports = KeyBinding

const defaultKeystroke = {
  name: 'return',
  ctrl: false,
  shift: false,
  callback: () => {}
}

function KeyBinding (keystroke) {
  keystroke = Object.assign({}, defaultKeystroke, keystroke)

  keypress(process.stdin)
  process.stdin.on('keypress', (ch, key) => {
    console.log(ch, key)
    handleKeypress(key, keystroke)
  })

  process.stdin.setRawMode(true)
  process.stdin.resume()
}

function handleKeypress (key, keystroke) {
  if (
    key &&
    key.name === keystroke.name &&
    key.ctrl === keystroke.ctrl &&
    key.shift === keystroke.shift
  ) keystroke.callback(key)
}
