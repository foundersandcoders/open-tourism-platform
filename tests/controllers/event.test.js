const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Place = require('../../src/models/Place.js')
const Event = require('../../src/models/Event.js')
const { dropCollectionAndEnd, dropCollectionsAndEnd } = require('../helpers/index.js')
const { validEvent1, validEvent2, validEvent3, invalidEvent1, invalidEvent2, invalidEvent3, invalidEvent4 } = require('../fixtures/events.json')
const { validPlace1 } = require('../fixtures/places.json')

// Tests for: GET /events
tape('GET /events when nothing in database', t => {
  supertest(server)
    .get('/events')
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
        .get('/events')
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
      // supertest(server)
      //   .get('/events?categories=dining')
      //   .expect(200)
      //   .expect('Content-Type', /json/)
      //   .end((err, res) => {
      //     if (err) t.fail(err)
      //     t.equal(res.body.length, 2, 'query response body should be an array with length 2')
      //     t.ok(res.body.map(event => event.en.name).includes(validEvent2.en.name), 'results should be filtered correctly by url query parameters')
      //   })
      supertest(server)
        .get('/events?date_from=2017-05-01&date_to=2017-05-10')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.length, 1, 'query response body should be an array with length 1')
          t.ok(res.body.map(event => event.en.name).includes(validEvent2.en.name), 'results should be filtered correctly by url date-related query parameters')
          dropCollectionAndEnd(Event, t)
        })
    })
    .catch(err => t.end(err))
})

tape('GET /events, check place field is populated', t => {
  Place.create(validPlace1)
    .then(createdPlace => {
      const event = Object.assign(validEvent1, { placeId: createdPlace.id })
      return Event.create(event)
    })
    .then(createdEvent => {
      supertest(server)
        .get('/events')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(typeof res.body[0].placeId, 'object', 'returned event should have placeId field populated')
          dropCollectionsAndEnd([Place, Event], t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /events/:id
tape('GET /events/:id with invalid id', t => {
  supertest(server)
    .get('/events/10')
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
    .get('/events/507f1f77bcf86cd799439011')
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
      const event = Object.assign(validEvent1, { placeId: createdPlace.id })
      return Event.create(event)
    })
    .then(createdEvent => {
      supertest(server)
        .get(`/events/${createdEvent.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.en.name, validEvent1.en.name, 'should get event with correct name.')
          t.equal(typeof res.body.placeId, 'object', 'returned event should have placeId field populated')
          dropCollectionsAndEnd([Place, Event], t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /events
tape('POST /events adding invalid event', t => {
  supertest(server)
    .post('/events')
    .send(invalidEvent1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.message, 'Validation Failed', 'Correct message is sent back')
      t.equal(res.body.reasons[0], 'one of Path `en` or Path `ar` required', 'Correct reason is sent back')
      dropCollectionAndEnd(Event, t)
    })
})

tape('POST /events adding event with invalid placeId field', t => {
  supertest(server)
    .post('/events')
    .send(invalidEvent2)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.message, 'Validation Failed', 'Correct message is sent back')
      dropCollectionAndEnd(Event, t)
    })
})

tape('POST /events adding valid event', t => {
  supertest(server)
    .post('/events')
    .send(validEvent1)
    .expect(201)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.en.name, validEvent1.en.name, 'Correct object is added')
      t.ok(res.body._id && res.body.createdAt && res.body.updatedAt, 'id and timestamp fields added')
      // Now check whether it is in the database
      Event.findById(res.body._id)
        .then(event => {
          t.equal(event.categories[0], res.body.categories[0], 'Event is in the database')
          dropCollectionAndEnd(Event, t)
        })
        .catch(err => {
          t.fail(err)
          dropCollectionAndEnd(Event, t)
        })
    })
})

tape('POST /events adding events with invalid categories - wrong categories', t => {
  supertest(server)
    .post('/events')
    .send(invalidEvent2)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.reasons[0], '`eating` is not a valid enum value for path `categories`.', 'Correct reason is sent back')
      dropCollectionAndEnd(Event, t)
    })
})

tape('POST /events adding events with invalid categories - null in array', t => {
  supertest(server)
    .post('/events')
    .send(invalidEvent3)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.reasons[0], '`null` is not a valid enum value for path `categories`.', 'Correct reason is sent back')
      dropCollectionAndEnd(Event, t)
    })
})

tape('POST /events adding events with invalid categories - empty array', t => {
  supertest(server)
    .post('/events')
    .send(invalidEvent4)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.reasons[0], 'Path `categories` is required.', 'Correct message is sent back')
      dropCollectionAndEnd(Event, t)
    })
})

// Tests for: PUT /events/:id
tape('PUT /events/:id with invalid id', t => {
  supertest(server)
    .put('/events/invalidId')
    .send(validEvent1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
      dropCollectionAndEnd(Event, t)
    })
})

tape('PUT /events/:id with valid id and valid new event data', t => {
  Event.create(validEvent1)
    .then(createdEvent => {
      supertest(server)
        .put(`/events/${createdEvent.id}`)
        .send(validEvent2)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.en.name, validEvent2.en.name, 'event should be correctly updated, and the updated event returned')
          // check event has been updated
          Event.findById(res.body._id)
            .then(event => {
              t.equal(event.categories[0], res.body.categories[0], 'Event is in the database')
              dropCollectionAndEnd(Event, t)
            })
            .catch(err => {
              t.fail(err)
              dropCollectionAndEnd(Event, t)
            })
        })
    })
    .catch(err => t.end(err))
})

// Tests for: DELETE /events/:id
tape('DELETE /events/:id with invalid id', t => {
  supertest(server)
    .delete('/events/invalid')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'Error message sent back')
      t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
      t.end()
    })
})

tape('DELETE /users/:id with id of something not in the database', t => {
  supertest(server)
    .delete('/users/507f1f77bcf86cd799439011')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'Message sent back')
      t.equal(res.body.message, 'Cannot find document to delete', 'Correct message is sent back')
      t.end()
    })
})

tape('DELETE /events/:id with valid ID', t => {
  Event.create(validEvent1, validEvent2)
    .then(eventToBeDeleted => {
      supertest(server)
        .delete(`/events/${eventToBeDeleted.id}`)
        .expect(204)
        .end((err, res) => {
          if (err) t.fail(err)
          t.deepEqual(res.body, {}, 'Nothing returned after deletion')
          // check our database now has one fewer event
          Event.find()
            .then(events => {
              t.equal(events.length, 1, 'Events should now be length 1')
              t.ok(events[0].id !== eventToBeDeleted.id, 'deleted event no longer in DB')
              dropCollectionAndEnd(Event, t)
            })
            .catch(err => {
              t.fail(err)
              dropCollectionAndEnd(Event, t)
            })
        })
    })
    .catch(err => t.end(err))
})
