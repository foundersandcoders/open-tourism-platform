require('../config.js')
const tape = require('tape')
const dbConnection = require('../src/db/connect.js')

dbConnection.once('open', () => {
  // test controllers
  // require('./controllers/user.test.js')
  // require('./controllers/place.test.js')
  require('./controllers/event.test.js')
  // require('./controllers/product.test.js')

  // test error handlers
  // require('./middleware/customErrorHandler.test.js')
  // require('./middleware/mongoErrorHandler.test.js')
  // require('./middleware/mongooseErrorHandler.test.js')

  tape.onFinish(() => {
    dbConnection.close()
  })
})

dbConnection.on('error', err => {
  throw err
})
