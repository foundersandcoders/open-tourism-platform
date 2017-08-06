const tape = require('tape')
const supertest = require('supertest')

const server = require('../../src/server')

const Client = require('../../src/models/auth/Client.js')

// Tests for: GET /oauth/authorize
// need to add valid client to test this properly
// should return custom page (handlebars?) showing the app, the owner, the requested permissions (if we implement this)
tape('GET /oauth/authorize, should return form page', t => {
  supertest(server)
    .get('/oauth/authorize')
    .query({
      client_id: 'testClientId',
      redirect_uri: 'testRedirect'
    })
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      t.error(err)
      t.ok(res.body.includes)
      t.end()
    })
})

// Tests for: POST /oauth/authorize
// need to add valid user, token, client
tape('POST /oauth/authorize', t => {
  supertest(server)
    .post('/oauth/authorize')
    .set('Authorization', 'bearer myToken')
    .query({
      client_id: 'testClientId',
      redirect_uri: 'testRedirect',
      state: 'randomString',
      response_type: 'code'
    })
    .expect(302)
    .end((err, res) => {
      t.error(err)
      t.end()
    })
})