require('../config.js')
const test = require('tape')
const dbConnection = require('../db/connect.js')
// const server = require('../src/server.js')
// const supertest = require('supertest')
// const Users = require('../db/models/User.js')
// ^ will use these in the futue
test('Check tape is working before db connection', t => {
  t.equal(1, 1, 'One is one')
  t.end()
})

test('Check db connection', t => {
  dbConnection.once('open', () => {
    t.pass('Connected to database')
    t.end()
  })
})

test.onFinish(() => {
  dbConnection.close()
})
