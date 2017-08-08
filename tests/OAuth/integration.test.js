const url = require('url')
const qs = require('querystring')

const tape = require('tape')
const supertest = require('supertest')

const server = require('../../src/server')

const Client = require('../../src/models/auth/Client.js')
const User = require('../../src/models/User.js')
const AuthorizationCode = require('../../src/models/auth/AuthorizationCode.js')

const { client } = require('../fixtures/auth/clients.json')
const { user } = require('../fixtures/users.json')

tape('emptying db.', t => {
  Promise.resolve()
  .then(() => User.remove({}))
  .then(() => Client.remove({}))
  .then(() => AuthorizationCode.remove({}))
  .then(() => t.end())
  .catch(err => t.end(err))
})

// Tests for: GET /oauth/authorize
// should return custom page (handlebars?) showing the app, the owner, the requested permissions (if we implement this)
// tape('GET /oauth/authorize, should return form page', t => {
//   supertest(server)
//     .get('/oauth/authorize')
//     .query({
//       client_id: 'testClientId',
//       redirect_uri: 'testRedirect'
//     })
//     .expect(200)
//     .expect('Content-Type', /html/)
//     .end((err, res) => {
//       t.error(err)
//       t.end()
//     })
// })

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
      // .set('Authorization', 'bearer token')
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
  console.log('auth code:')
  console.log(authCode)
  supertest(server)
    .post('/oauth/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      grant_type: 'authorization_code',
      client_id: client._id,
      client_secret: client.secret,
      code: authCode
    })
    .expect(200)
    .end((err, res) => {
      t.error(err)
      console.log(res.error.text)
      t.end()
    }) 
})

