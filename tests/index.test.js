require('../config.js')
const tape = require('tape')
const dbConnection = require('../src/db/connect.js')

const User = require('../src/models/User.js')
const Place = require('../src/models/Place.js')
const Event = require('../src/models/Event.js')
const Product = require('../src/models/Product.js')

dbConnection.once('open', () => {
  tape('emptying test db.', t => {
    Promise.resolve()
    .then(() => User.remove({}))
    .then(() => Place.remove({}))
    .then(() => Event.remove({}))
    .then(() => Product.remove({}))
    .then(() => t.end())
    .catch(err => t.end(err))
  })

  // test controllers
  // require('./controllers/user.test.js')
  require('./controllers/place.test.js')
  require('./controllers/event.test.js')
  require('./controllers/product.test.js')

  // test error handlers
  // require('./middleware/customErrorHandler.test.js')
  // require('./middleware/mongoErrorHandler.test.js')
  // require('./middleware/mongooseErrorHandler.test.js')

  // test oauth flow
  // require('./oauth/integration.test.js')

  tape.onFinish(() => {
    dbConnection.close()
  })
})

dbConnection.on('error', err => {
  throw err
})
