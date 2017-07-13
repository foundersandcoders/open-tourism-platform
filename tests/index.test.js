require('../config.js')
const test = require('tape')
const dbConnection = require('../db/connect.js')
// const server = require('../src/server.js')
// const supertest = require('supertest')
// const Users = require('../db/models/User.js')
// ^ will use these in the futue

dbConnection.once('open', () => {
  require('./test_1.test.js')
  require('./test_2.test.js')

  test.onFinish(() => {
    dbConnection.close()
  })
})

dbConnection.on('error', err => {
  throw err
})
