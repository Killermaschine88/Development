function globalStart() {
  require('dotenv').config()
  global.color = require('colorette')

  //starting web server
  const app = require('express')()
  app.listen(3000)
  app.get('/', (req, res) => res.send('OK'))
}

module.exports = { globalStart }