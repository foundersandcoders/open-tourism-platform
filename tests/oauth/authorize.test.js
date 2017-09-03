const tape = require('tape')
const supertest = require('supertest')
const url = require('url')
const qs = require('querystring')
const server = require('../../src/server')

const Client = require('../../src/models/auth/Client.js')
const User = require('../../src/models/User.js')
const AuthorizationCode = require('../../src/models/auth/AuthorizationCode.js')
const Token = require('../../src/models/auth/Token.js')

const { makeLoggedInToken } = require('../../src/controllers/session.js')
const { validUser1 } = require('../fixtures/users.json')
const { client } = require('../fixtures/auth/clients.json')

tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Client.remove({}),
    AuthorizationCode.remove({}),
    Token.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

// initiate variables to hold data added to the database, to be used in tests
let createdClient, token

tape('filling db.', t => {
  Promise.all([
    Client.create(client),
    makeLoggedInToken(validUser1)
  ])
  .then(([_client, _token]) => {
    createdClient = _client
    token = _token
    t.end()
  })
  .catch(err => t.end(err))
})

// Tests for: GET /oauth/authorize
// should render page or redirect to login if not authorized

tape('GET /oauth/authorize without required query params', t => {
  supertest(server)
    .get('/oauth/authorize')
    .query({ state: 'random' })
    .expect(400)
  .then(res => t.end())
  .catch(err => t.end(err))
})

tape('GET /oauth/authorize without authorization token, should redirect to login', t => {
  supertest(server)
    .get('/oauth/authorize')
    .query({
      client_id: createdClient.id,
      redirect_uri: createdClient.redirectUris[0],
      state: 'random'
    })
    .expect(302)
    .expect('Location', /login/)
    .expect('Location', /return_to/)
  .then(res => {
    const parsedLocationUrl = url.parse(res.headers.location)
    const locationQueries = qs.parse(parsedLocationUrl.query)
    t.equal(locationQueries.client_id, createdClient.id, 'Correct client id in redirect query')
    t.ok(locationQueries.return_to.includes('state=random'), 'return_to query added')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('GET /oauth/authorize with token, should return form page', t => {
  supertest(server)
    .get('/oauth/authorize')
    .set('Cookie', `token=${token}`)
    .query({
      client_id: createdClient.id,
      redirect_uri: createdClient.redirectUris[0],
      state: 'random'
    })
    .expect(200)
    .expect('Content-Type', /html/)
  .then(res => {
    t.ok(res.text.includes('<h2>Authorization request</h2>'), 'rendered html should be correct')
    t.ok(res.text.includes(createdClient.name), 'html page should contain client name')
    t.end()
  })
  .catch(err => t.end(err))
})
