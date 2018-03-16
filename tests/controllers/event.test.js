const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Place = require('../../src/models/Place.js')
const Event = require('../../src/models/Event.js')
const User = require('../../src/models/User.js')
const Token = require('../../src/models/auth/Token.js')

const { auth: authErrMessages } = require('../../src/constants/errors')

const { validEvent1, validEvent2, validEvent3, invalidEvent1, invalidEvent2, invalidEvent3, invalidEvent4 } = require('../fixtures/events.json')
const { validPlace1 } = require('../fixtures/places.json')
const { validBasicUser, superUser, user } = require('../fixtures/users.json')
const { token } = require('../fixtures/auth/tokens.json')

const { dropCollectionAndEnd, dropCollectionsAndEnd } = require('../helpers/index.js')

const { makeLoggedInToken } = require('../../src/controllers/session.js')

// Tests for: GET /events
tape('GET /events when nothing in database', t => {
  supertest(server)
    .get('/api/v1/events')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.length, 0, 'should initially return empty array')
      dropCollectionAndEnd(Event, t)
    })
})

tape('GET /events, with and without query parameters', t => {
  Event.create(validEvent1, validEvent2, validEvent3)
    .then(() => {
      supertest(server)
        .get('/api/v1/events')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that event correctly
          t.equal(res.body.length, 3, 'response body should be an array with length 3')
          const eventNames = res.body.map(event => event.en.name)
          const eventStartTimes = res.body.map(event => event.startTime)
          t.ok(eventNames.includes(validEvent1.en.name), 'first event has been added')
          t.ok(eventNames.includes(validEvent2.en.name), 'second event has been added')
          t.ok(eventNames.includes(validEvent3.en.name), 'third event has been added')
          t.deepEqual(eventStartTimes, eventStartTimes.sort(), 'returned events should be sorted by startTime')
        })
      supertest(server)
        .get('/api/v1/events?date_from=2017-05-01&date_to=2017-05-10')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.length, 1, 'query response body should be an array with length 1')
          t.ok(res.body[0], validEvent2.en.name, 'results should be filtered correctly by url query parameters')
          dropCollectionAndEnd(Event, t)
        })
    })
    .catch(err => t.end(err))
})

tape('GET /events, check place field is populated', t => {
  Place.create(validPlace1)
    .then(createdPlace => {
      const event = Object.assign(validEvent1, { place: createdPlace.id })
      return Event.create(event)
    })
    .then(createdEvent => {
      supertest(server)
        .get('/api/v1/events')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(typeof res.body[0].place, 'object', 'returned event should have place field populated')
          dropCollectionsAndEnd([Place, Event], t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /events/:id
tape('GET /events/:id with invalid id', t => {
  supertest(server)
    .get('/api/v1/events/10')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'Invalid id', 'response message is correct')
      dropCollectionAndEnd(Event, t)
    })
})

tape('GET /events/:id with valid id of something not in the database', t => {
  supertest(server)
    .get('/api/v1/events/507f1f77bcf86cd799439011')
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'No document matching that id', 'response message is correct')
      dropCollectionAndEnd(Event, t)
    })
})

tape('GET /events/:id, check place field is populated', t => {
  Place.create(validPlace1)
    .then(createdPlace => {
      const event = Object.assign(validEvent1, { place: createdPlace.id })
      return Event.create(event)
    })
    .then(createdEvent => {
      supertest(server)
        .get(`/api/v1/events/${createdEvent.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.en.name, validEvent1.en.name, 'should get event with correct name.')
          t.equal(typeof res.body.place, 'object', 'returned event should have place field populated')
          dropCollectionsAndEnd([Place, Event], t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /events
tape('POST /events adding invalid event', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) =>
  supertest(server)
    .post('/api/v1/events')
    .set('Cookie', `token=${token}`)
    .send(invalidEvent1)
    .expect(400)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.message, 'Validation Failed', 'Correct message is sent back')
      t.equal(res.body.reasons[0], 'one of Path `en` or Path `ar` required', 'Correct reason is sent back')
      dropCollectionsAndEnd([Event, User], t)
    }).catch(err => t.fail(err))
})

tape('POST /events adding event with invalid place field', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) =>
  supertest(server)
    .post('/api/v1/events')
    .set('Cookie', `token=${token}`)
    .send(invalidEvent2)
    .expect(400)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.message, 'Validation Failed', 'Correct message is sent back')
      dropCollectionsAndEnd([Event, User], t)
    }).catch(err => t.fail(err))
})

tape('POST /events adding valid event', t => {
  Promise.all([
    User.create([validBasicUser, superUser]), // superUser for sending emails
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) =>
  supertest(server)
    .post('/api/v1/events')
    .set('Cookie', `token=${token}`)
    .send(validEvent1)
    .expect(201)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.equal(res.body.en.name, validEvent1.en.name, 'Correct object is added')
      t.ok(res.body._id && res.body.createdAt && res.body.updatedAt, 'id and timestamp fields added')
      // Now check whether it is in the database
      Event.findById(res.body._id)
        .then(event => {
          t.equal(event.categories[0], res.body.categories[0], 'Event is in the database')
          dropCollectionsAndEnd([Event, User], t)
        })
        .catch(err => {
          t.fail(err)
          dropCollectionsAndEnd([Event, User], t)
        })
    }).catch(err => t.fail(err))
})

tape('POST /events adding events with invalid categories - wrong categories', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) =>
  supertest(server)
    .post('/api/v1/events')
    .set('Cookie', `token=${token}`)
    .send(invalidEvent2)
    .expect(400)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.reasons[0], '`eating` is not a valid enum value for path `categories`.', 'Correct reason is sent back')
      dropCollectionsAndEnd([Event, User], t)
    }).catch(err => t.fail(err))
})

tape('POST /events adding events with invalid categories - null in array', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) =>
  supertest(server)
    .post('/api/v1/events')
    .set('Cookie', `token=${token}`)
    .send(invalidEvent3)
    .expect(400)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.reasons[0], '`null` is not a valid enum value for path `categories`.', 'Correct reason is sent back')
      dropCollectionsAndEnd([Event, User], t)
    }).catch(err => t.fail(err))
})

tape('POST /events adding events with invalid categories - empty array', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) =>
  supertest(server)
    .post('/api/v1/events')
    .set('Cookie', `token=${token}`)
    .send(invalidEvent4)
    .expect(400)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.reasons[0], 'Path `categories` is required.', 'Correct message is sent back')
      dropCollectionsAndEnd([Event, User], t)
    }).catch(err => t.fail(err))
})

// Tests for: PUT /events/:id
tape('PUT /events/:id, unauthorized as not logged in', t => {
  supertest(server)
    .put('/api/v1/events/id')
    .send(validEvent1)
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

tape('PUT /events/:id, unauthorized as basic user', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser),
    Event.create(validEvent1)
  ])
  .then(([ _, token, event ]) => supertest(server)
    .put(`/api/v1/events/${event.id}`)
    .set('Cookie', `token=${token}`)
    .send(validEvent1)
    .expect(401)
  )
  .then(() => Promise.all([
    User.remove({}),
    Event.remove({})
  ]))
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('PUT /events/:id with invalid id', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser)
  ])
  .then(([ _, token ]) => supertest(server)
    .put('/api/v1/events/invalidId')
    .set('Cookie', `token=${token}`)
    .send(validEvent1)
    .expect(400)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
    dropCollectionsAndEnd([Event, User], t)
  })
  .catch(err => t.end(err))
})

tape('PUT /events/:id with valid id and valid new event data', t => {
  Promise.all([
    User.create(user),
    Token.create(token),
    Event.create(validEvent1)
  ])
  .then(([ _, token, createdEvent ]) =>
    supertest(server)
    .put(`/api/v1/events/${createdEvent.id}`)
    .set('Authorization', 'Bearer ' + token.accessToken)
    .send(validEvent2)
    .expect(200)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.en.name, validEvent2.en.name, 'event should be correctly updated, and the updated event returned')
    // check event has been updated
    return Promise.all([ Event.findById(res.body._id), Promise.resolve(res) ])
  })
  .then(([ event, res ]) => {
    t.equal(event.categories[0], res.body.categories[0], 'Event is in the database')
    dropCollectionsAndEnd([ Event, Token, User ], t)
  })
  .catch(err => t.end(err))
})

// Tests for: DELETE /events/:id
tape('DELETE /events/:id, unauthorized as not logged in', t => {
  supertest(server)
    .delete('/api/v1/events/id')
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

tape('DELETE /events/:id with invalid id', t => {
  Promise.all([
    User.create(superUser),
    makeLoggedInToken(superUser)
  ])
  .then(([ _, token ]) => supertest(server)
    .delete('/api/v1/events/invalidId')
    .set('Cookie', `token=${token}`)
    .expect(400)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.ok(res.body.message, 'Error message sent back')
    t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
  })
  .then(() => dropCollectionsAndEnd([ Token, User ], t))
  .catch(err => t.end(err))
})

tape('DELETE /events/:id with id of something not in the database', t => {
  Promise.all([
    User.create(superUser),
    makeLoggedInToken(superUser)
  ])
  .then(([ _, token ]) => supertest(server)
    .delete('/api/v1/events/507f1f77bcf86cd799439011')
    .set('Cookie', `token=${token}`)
    .expect(400)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.ok(res.body.message, 'Message sent back')
    t.equal(res.body.message, 'Cannot find document to delete', 'Correct message is sent back')
  })
  .then(() => dropCollectionsAndEnd([ Token, User ], t))
  .catch(err => t.end(err))
})

tape('DELETE /events/:id with valid ID', t => {
  let eventId
  Promise.all([
    User.create(superUser),
    makeLoggedInToken(superUser),
    Event.create(validEvent1, validEvent2)
  ])
  .then(([ _, token, eventToBeDeleted ]) => {
    eventId = eventToBeDeleted.id
    return supertest(server)
      .delete(`/api/v1/events/${eventId}`)
      .set('Cookie', `token=${token}`)
      .expect(204)
  })
  .then(res => {
    t.deepEqual(res.body, {}, 'Nothing returned after deletion')
    return Event.find()
  })
  .then(events => {
    t.equal(events.length, 1, 'Events should now be length 1')
    t.ok(events[0].id !== eventId, 'deleted event no longer in DB')
    dropCollectionsAndEnd([ Event, Token, User ], t)
  })
  .catch(err => t.end(err))
})
