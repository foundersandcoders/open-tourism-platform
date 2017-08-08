require('../../config.js')
const tape = require('tape')
const dbConnection = require('../../src/db/connect.js')

dbConnection.once('open', () => {
  // the tests
  require('./integration.test.js')

  tape.onFinish(() => {
    dbConnection.close()
  })
})

dbConnection.on('error', err => {
  throw err
})
