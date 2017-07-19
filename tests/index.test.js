require('../config.js')
const tape = require('tape')
const dbConnection = require('../src/db/connect.js')

dbConnection.once('open', () => {
  // require('./controllers/user.test.js')
  require('./controllers/place.test.js')
  // require('./controllers/event.test.js')
  // require('./controllers/product.test.js')

  tape.onFinish(() => {
    dbConnection.close()
  })
})

dbConnection.on('error', err => {
  throw err
})
