const tape = require('tape')
const supertest = require('supertest')
const server = require('../src/server.js')

const Client = require('../src/models/auth/Client.js')
const { client } = require('./fixtures/auth/clients.json')

tape('emptying db.', t => {
  Promise.all([
    Client.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('filling db', t => {
  Client.create(client)
  .then(() => t.end())
  .catch(err => t.end(err))
})

// tests for GET /login

tape('GET /login', t => {
  supertest(server)
    .get('/login')
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      t.error(err)
      t.ok(res.text.includes('action="/login"'), 'should return form with correct action')
      t.end()
    })
})

tape('GET /login, with redirect queries to return to OAuth authorize page', t => {
  supertest(server)
    .get('/login')
    .query({
      client_id: client._id,
      return_to: `/oauth/authorize?client_id=${client._id}&redirect_uri=https%3A%2F%2Fwww.test.com&state=random`
    })
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      t.error(err)
      t.ok(res.text.includes('action="/login?return_to'), 'should return form with correct action')
      t.ok(res.text.includes(client.name), 'should render page with client name')
      t.end()
    })
})

// tests for GET /register

tape('GET /register', t => {
  supertest(server)
    .get('/register')
    .expect(200)
    .expect('Content-Type', /html/)
    .end((err, res) => {
      t.error(err)
      t.ok(res.text.includes('register'), 'should return page including "register"')
      t.end()
    })
})
