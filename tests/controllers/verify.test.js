const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Place = require('../../src/models/Place.js')
const Event = require('../../src/models/Event.js')
const User = require('../../src/models/User.js')
const Token = require('../../src/models/auth/Token.js')

const { auth: authErrMessages } = require('../../src/constants/errors')
const { validEvent1 } = require('../fixtures/events.json')
const { validPlace1 } = require('../fixtures/places.json')
const { validBasicUser, superUser, validAdminUser } = require('../fixtures/users.json')
const { token } = require('../fixtures/auth/tokens.json')

const { dropCollectionsAndEnd } = require('../helpers/index.js')

const { makeLoggedInToken } = require('../../src/controllers/session.js')

// Tests for: PUT /verify/events/:id
tape('PUT /verify/events/:id, unauthorized as not logged in', t => {
  supertest(server)
    .put('/api/v1/verify/events/id')
    .expect(401)
  .then(res => {
    t.equal(
      res.body.message,
      authErrMessages.UNAUTHORIZED,
      'should return correct error message')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('PUT /verify/events/:id, unauthorized as basic user', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser),
    Event.create(validEvent1)
  ])
  .then(([ _, token, event ]) => supertest(server)
    .put(`/api/v1/verify/events/${event.id}`)
    .set('Cookie', `token=${token}`)
    .expect(401)
  )
  .then(() => Promise.all([
    User.remove({}),
    Event.remove({})
  ]))
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('PUT /verify/events/:id with invalid id', t => {
  Promise.all([
    User.create(validAdminUser),
    makeLoggedInToken(validAdminUser)
  ])
  .then(([ _, token ]) => supertest(server)
    .put('/api/v1/verify/events/invalidId')
    .set('Cookie', `token=${token}`)
    .expect(400)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
    dropCollectionsAndEnd([Event, User], t)
  })
  .catch(err => t.end(err))
})

tape('PUT /verify/events/:id with valid id and user', t => {
  Promise.all([
    User.create(superUser),
    Token.create(token),
    Event.create(validEvent1)
  ])
  .then(([ _, token, createdEvent ]) =>
    supertest(server)
    .put(`/api/v1/verify/events/${createdEvent.id}`)
    .set('Authorization', 'Bearer ' + token.accessToken)
    .expect(200)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.ok(res.body.verified, 'event should be correctly updated, and the updated event returned')
    // check event has been updated
    return Promise.all([ Event.findById(res.body._id), Promise.resolve(res) ])
  })
  .then(([ event, res ]) => {
    t.equal(event.categories[0], res.body.categories[0], 'Event is in the database')
    dropCollectionsAndEnd([ Event, Token, User ], t)
  })
  .catch(err => t.end(err))
})

// Tests for: PUT /verify/places/:id
tape('PUT /verify/places/:id, unauthorized as not logged in', t => {
  supertest(server)
    .put('/api/v1/verify/places/id')
    .expect(401)
  .then(res => {
    t.equal(
      res.body.message,
      authErrMessages.UNAUTHORIZED,
      'should return correct error message')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('PUT /verify/places/:id, unauthorized as basic user', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser),
    Place.create(validPlace1)
  ])
  .then(([ _, token, place ]) => supertest(server)
    .put(`/api/v1/verify/places/${place.id}`)
    .set('Cookie', `token=${token}`)
    .expect(401)
  )
  .then(() => Promise.all([
    User.remove({}),
    Place.remove({})
  ]))
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('PUT /verify/places/:id with invalid id', t => {
  Promise.all([
    User.create(validAdminUser),
    makeLoggedInToken(validAdminUser)
  ])
  .then(([ _, token ]) => supertest(server)
    .put('/api/v1/verify/places/invalidId')
    .set('Cookie', `token=${token}`)
    .expect(400)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
    dropCollectionsAndEnd([Place, User], t)
  })
  .catch(err => t.end(err))
})

tape('PUT /verify/places/:id with valid id and user', t => {
  Promise.all([
    User.create(superUser),
    Token.create(token),
    Place.create(validPlace1)
  ])
  .then(([ _, token, createdPlace ]) =>
    supertest(server)
    .put(`/api/v1/verify/places/${createdPlace.id}`)
    .set('Authorization', 'Bearer ' + token.accessToken)
    .expect(200)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.ok(res.body.verified, 'place should be correctly updated, and the updated place returned')
    // check place has been updated
    return Promise.all([ Place.findById(res.body._id), Promise.resolve(res) ])
  })
  .then(([ place, res ]) => {
    t.equal(place.categories[0], res.body.categories[0], 'place is in the database')
    dropCollectionsAndEnd([ Place, Token, User ], t)
  })
  .catch(err => t.end(err))
})
