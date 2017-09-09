const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server')

const validateHeaderToken = require('../../src/middleware/validateHeaderToken')

const User = require('../../src/models/User.js')
const Token = require('../../src/models/auth/Token.js')
const { user } = require('../fixtures/users.json')
const { token } = require('../fixtures/auth/tokens.json')

// add route for testing
server.get('/test/validateHeaderToken',
  validateHeaderToken({ credentialsRequired: false }),
  (req, res) => {
    res.send(req.user)
})

tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Token.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('filling db.', t => {
  Promise.all([
    User.create(user),
    Token.create(token)
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('test for validateHeaderToken middleware', t => {
  supertest(server)
  .get('/test/validateHeaderToken')
  .set('Authorization', 'Bearer ' + token.accessToken)
  .expect(200)
  .then(res => {
    t.equal(res.body.username, user.username, 'token should add correct user data to request.')
    t.end()
  })
  .catch(err => t.end(err))
})

