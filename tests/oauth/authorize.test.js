const tape = require('tape')
const supertest = require('supertest')

const server = require('../../src/server')

const Client = require('../../src/models/auth/Client.js')
const User = require('../../src/models/User.js')
const AuthorizationCode = require('../../src/models/auth/AuthorizationCode.js')
const Token = require('../../src/models/auth/Token.js')

const { client } = require('../fixtures/auth/clients.json')

tape('emptying db.', t => {
  Promise.resolve()
  .then(() => User.remove({}))
  .then(() => Client.remove({}))
  .then(() => AuthorizationCode.remove({}))
  .then(() => Token.remove({}))
  .then(() => t.end())
  .catch(err => t.end(err))
})

// Tests for: GET /oauth/authorize
// should render page or redirect to login if not authorized
tape('GET /oauth/authorize, should return form page', t => {
  Promise.resolve()
  .then(() => Client.create(client))
  .then(createdClient => {
    supertest(server)
      .get('/oauth/authorize')
      .query({
        client_id: createdClient.id,
        redirect_uri: createdClient.redirectUris[0]
      })
      .expect(200)
      .expect('Content-Type', /html/)
      .end((err, res) => {
        t.error(err)
        t.ok(res.text.includes('If you authorize this app'), 'html page should contain correct text')
        t.end()
      })   
  })
  .catch(err => t.end(err))
})
