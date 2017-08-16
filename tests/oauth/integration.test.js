const url = require('url')
const qs = require('querystring')

const tape = require('tape')
const supertest = require('supertest')

const server = require('../../src/server')

const Client = require('../../src/models/auth/Client.js')
const User = require('../../src/models/User.js')
const AuthorizationCode = require('../../src/models/auth/AuthorizationCode.js')
const Token = require('../../src/models/auth/Token.js')

const { client } = require('../fixtures/auth/clients.json')
const { user } = require('../fixtures/users.json')

tape('emptying db.', t => {
  Promise.resolve()
  .then(() => User.remove({}))
  .then(() => Client.remove({}))
  .then(() => AuthorizationCode.remove({}))
  .then(() => Token.remove({}))
  .then(() => t.end())
  .catch(err => t.end(err))
})

// the first test creates the authCode, the second test uses it
let authCode

// Tests for: POST /oauth/authorize
tape('POST /oauth/authorize should successfully redirect and create authorization code', t => {
  Promise.resolve()
  // add valid user, client
  .then(() => User.create(user))
  .then(() => Client.create(client))
  // do the test
  .then(() => {
    const randomState = 'randomString'
    supertest(server)
      .post('/oauth/authorize')
      .query({
        client_id: client._id,
        redirect_uri: client.redirectUris[0],
        state: randomState,
        response_type: 'code'
      })
      .expect(302)
      // test query params of redirection location
      .expect('Location', /code=/)
      .expect('Location', /state=/)
      .end((err, res) => {
        t.error(err)
        const parsedLocationUrl = url.parse(res.headers.location)
        const locationQueries = qs.parse(parsedLocationUrl.query)
        t.equal(locationQueries.state, randomState, 'state on redirect location should be correct.')
        authCode = locationQueries.code
        t.end()
      })
  })
  .catch(err => t.end(err))
})

// Tests for: POST /oauth/token
tape('POST /oauth/token should send back a token', t => {
  supertest(server)
    .post('/oauth/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      grant_type: 'authorization_code',
      client_id: client._id,
      client_secret: client.secret,
      redirect_uri: client.redirectUris[0],
      code: authCode
    })
    .expect(200)
    .end((err, res) => {
      t.error(err)
      t.ok(res.body.access_token, 'response body should contain access_token')
      t.equal(res.body.token_type, 'Bearer', 'response body.token_type should be "Bearer"')
      t.ok(res.body.expires_in, 'response body should contain expires_in')
      t.ok(res.body.refresh_token, 'response body should contain refresh_token')
      t.end()
    })
})
