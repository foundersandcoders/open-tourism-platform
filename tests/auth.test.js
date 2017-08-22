require('../config.js')
const tape = require('tape')
const supertest = require('supertest')
const server = require('../src/server.js')

tape('test /login route', t => {
  supertest(server)
    .get('/login')
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.text.includes('login'), 'should return page including "login"')
      t.end()
    })
})

tape('GET /oauth/register-app route', t => {
  supertest(server)
    .get('/oauth/register-app')
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.text.includes('Register an app'), 'should return page including "Register an app"')
      t.end()
    })
})
