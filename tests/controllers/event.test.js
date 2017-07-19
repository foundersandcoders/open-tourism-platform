const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Event = require('../../src/models/Event.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validEvent1, validEvent2, validEvent3, invalidEvent1 } = require('../fixtures/events.json')
console.log(validEvent2)

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
          // check our get path returns that user correctly
          t.equal(res.body.length, 3, 'response body should be an array with length 3')
          t.ok(res.body.map(event => event.name).includes(validEvent1.name), 'first event has been added')
          t.ok(res.body.map(event => event.name).includes(validEvent2.name), 'second event has been added')
          t.ok(res.body.map(event => event.name).includes(validEvent3.name), 'third event has been added')
        })
      supertest(server)
        .get('/events?category=dining')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that user correctly
          t.equal(res.body.length, 2, 'query response body should be an array with length 2')
          t.equal(res.body[0].name, validEvent2.name, 'results should be filtered correctly by url query parameters')
          dropCollectionAndEnd(Event, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /events/:id
tape('GET /events/:id with id of something not in the database', t => {
  supertest(server)
    .get('/events/10')
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message.includes('Database error'), 'response message should contain "Database error"')
      dropCollectionAndEnd(Event, t)
    })
})

tape('GET /events/:id with id of something in the database', t => {
  Event.create(validEvent1)
    .then(result => {
      supertest(server)
        .get(`/events/${result.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.name, validEvent1.name, 'should get event with correct name.')
          dropCollectionAndEnd(Event, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /events

// Tests for: PUT /events/:id

// Tests for: DELETE /events/:id
