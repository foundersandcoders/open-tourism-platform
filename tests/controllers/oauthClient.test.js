const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Client = require('../../src/models/auth/Client.js')
const User = require('../../src/models/User.js')

const grants = require('../../src/constants/grants.js')

const { addUserWithHashedPassword } = require('../helpers/index.js')
const { makeLoggedInToken } = require('../../src/controllers/session.js')
const { dropCollectionsAndEnd } = require('../helpers/index.js')
const { user, validUser1 } = require('../fixtures/users.json')
const { client, clientFromFormData } = require('../fixtures/auth/clients.json')

tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Client.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('GET /oauth/clients when nothing in database', t => {
  addUserWithHashedPassword(validUser1)
  .then(() => makeLoggedInToken(validUser1))
  .then(token => {
    return supertest(server)
    .get('/oauth/clients')
    .set('Cookie', `token=${token}`)
    .expect(200)
  })
  .then(res => {
    t.equal(res.body.length, 0, 'should return empty array')
    dropCollectionsAndEnd([Client, User], t)
  })
  .catch(err => t.end(err))
})

tape('filling db', t => {
  Client.create(client)
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('GET /oauth/clients when something in database', t => {
  addUserWithHashedPassword(user)
  .then(() => makeLoggedInToken(user))
  .then(token => {
    return supertest(server)
    .get('/oauth/clients')
    .set('Cookie', `token=${token}`)
    .expect(200)
  })
  .then(res => {
    t.equal(res.body.length, 1, 'should return length 1 array')
    dropCollectionsAndEnd([Client, User], t)
  })
  .catch(err => t.end(err))
})

tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Client.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('POST /oauth/clients', t => {
  addUserWithHashedPassword(validUser1)
  .then((user) => {
    makeLoggedInToken(validUser1)
    .then(token => {
      return supertest(server)
      .post('/oauth/clients')
      .set('Cookie', `token=${token}`)
      .send(clientFromFormData)
      .expect(201)
    })
    .then(res => {
      t.equal(res.body.name, clientFromFormData.name, 'correct name added')
      t.equal(res.body.user, user.id, 'correct user added')
      t.equal(res.body.secret.length, 16, '16 digit secret added')
      t.deepEqual(res.body.redirectUris, clientFromFormData.redirectUris, 'correct redirectUris added')
      t.deepEqual(res.body.grants, [grants.authCode], 'correct grants added')
      t.ok(res.body._id, 'client given an id')
      dropCollectionsAndEnd([Client, User], t)
    })
    .catch(err => t.end(err))
  })
  .catch(err => t.end(err))
})

tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Client.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})
