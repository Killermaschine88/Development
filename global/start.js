function globalStart() {
  require('dotenv').config()
  global.color = require('colorette')
}

module.exports = { globalStart }