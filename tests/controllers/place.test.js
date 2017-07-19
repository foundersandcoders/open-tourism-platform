const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Place = require('../../src/models/Place.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validPlace1, validPlace2, invalidPlace1 } = require('../fixtures/places.json')

// Tests for: GET /places
tape('GET /places when nothing in database', (t) => {
  supertest(server)
    .get('/places')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.length, 0, 'should initially return empty array')
      dropCollectionAndEnd(Place, t)
    })
})

tape('GET /places, with and without query parameters', t => {
  Place.create(validPlace1, validPlace2)
    .then(() => {
      supertest(server)
        .get('/places')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that place correctly
          t.equal(res.body.length, 2, 'response body should be an array with length 2')
          t.ok(res.body.map(place => place.name).includes(validPlace1.name), 'first place has been added')
          t.ok(res.body.map(place => place.name).includes(validPlace2.name), 'second place has been added')
        })
      supertest(server)
        .get('/places?name=Basilica')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that place correctly
          t.equal(res.body.length, 1, 'filtered response body should be an array with length 1')
          t.equal(res.body[0].name, 'Basilica', 'results should be filtered correctly by url query parameters')
          dropCollectionAndEnd(Place, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /places/:id
tape('test /places/:id GET with id of something not in the database', (t) => {
  supertest(server)
    .get('/places/10')
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message.includes('Database error'), 'response message should contain "Database error"')
      dropCollectionAndEnd(Place, t)
    })
})

tape('test /places/:id GET with id of something in the database', (t) => {
  Place.create(validPlace1)
    .then(result => {
      supertest(server)
        .get(`/places/${result.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.name, validPlace1.name, 'should get place with correct name.')
          dropCollectionAndEnd(Place, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /places

// Tests for: PUT /places/:id

// Tests for: DELETE /places/:id
