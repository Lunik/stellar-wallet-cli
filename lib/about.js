const AboutText = require('../static/about')

module.exports = About

function About () {
  return new Promise((resolve) => {
    console.log(AboutText)
    resolve()
  })
}