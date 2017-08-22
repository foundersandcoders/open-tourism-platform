require('../config.js')
const tape = require('tape')
const supertest = require('supertest')
const server = require('../src/server.js')

tape('GET /login', t => {
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

tape('GET /register', t => {
  supertest(server)
    .get('/register')
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.text.includes('register'), 'should return page including "register"')
      t.end()
    })
})
