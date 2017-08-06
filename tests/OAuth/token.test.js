const tape = require('tape')
const supertest = require('supertest')

const server = require('../../src/server')

const Client = require('../../src/models/auth/Client.js')
const AuthorizationCode = require('../../src/models/auth/AuthorizationCode.js')

const { client } = require('../fixtures/auth/clients.json')
const { authorizationCode } = require('../fixtures/auth/authorizationCodes.json')

// Tests for: POST /oauth/token
tape('POST /oauth/token', t => {
  // create some data
  Client.create(client)
    .then(newClient => console.log(newClient))
    .then(() => AuthorizationCode.create(authorizationCode))
    .then(() => {
      // the actual test
      supertest(server)
        .post('/oauth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          grant_type: "authorization_code",
          client_id: client.id,
          client_secret: client.secret,
          code: authorizationCode.authorizationCode
        })
        .expect(200)
        .end((err, res) => {
          t.error(err)
          t.end()
        })
    })
    .catch(err => t.end(err))
})

// clear data after tests
tape('clear data', t => {
  Client.remove({})
    .then(() => console.log('removed all clients.'))
    .then(() => AuthorizationCode.remove({}))
    .then(() => console.log('removed all authorization codes.'))
    .then(() => {
      t.end()
    })
    .catch(err => t.end(err))
})
