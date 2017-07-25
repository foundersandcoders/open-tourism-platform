const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Place = require('../../src/models/Place.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validPlace1, validPlace2, invalidPlace1 } = require('../fixtures/places.json')

// Tests for: GET /places
tape('GET /places when nothing in database', t => {
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
tape('GET /places/:id with invalid id', t => {
  supertest(server)
    .get('/places/10')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'Invalid id', 'should return correct error message.')
      dropCollectionAndEnd(Place, t)
    })
})

tape('GET /places/:id with id of something in the database', t => {
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
tape('POST /places with valid place data', t => {
  supertest(server)
    .post('/places')
    .send(validPlace1)
    .expect(201)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.name, validPlace1.name, 'Correct object is added')
      t.ok(res.body._id && res.body.createdAt && res.body.updatedAt, 'id and timestamp fields added')
      // Now check whether it is in the database
      Place.findById(res.body._id)
        .then(place => {
          t.equal(place.name, res.body.name, 'Place is in the database')
          dropCollectionAndEnd(Place, t)
        })
        .catch(err => {
          t.fail(err)
          dropCollectionAndEnd(Place, t)
        })
    })
})

tape('POST /places with invalid place data', t => {
  supertest(server)
    .post('/places')
    .send(invalidPlace1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.message, 'Validation Failed', 'Correct message is sent back')
      dropCollectionAndEnd(Place, t)
    })
})

// Tests for: PUT /places/:id
tape('PUT /places/:id with id of something not in the database', t => {
  supertest(server)
    .put('/places/507f1f77bcf86cd799439011')
    .send(validPlace1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'Cannot find document to update', 'Correct message is sent back')
      dropCollectionAndEnd(Place, t)
    })
})

tape('PUT /places/:id with valid id and valid new place data', t => {
  Place.create(validPlace1)
    .then(createdPlace => {
      supertest(server)
        .put(`/places/${createdPlace.id}`)
        .send(validPlace2)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.name, validPlace2.name, 'place should be correctly updated, and the updated place returned')
          // check place was updated in db
          Place.findById(createdPlace.id)
            .then(place => {
              t.equal(place.name, validPlace2.name, 'Place has been updated in the database')
              dropCollectionAndEnd(Place, t)
            })
            .catch(err => {
              t.fail(err)
              dropCollectionAndEnd(Place, t)
            })
        })
    })
    .catch(err => t.end(err))
})

// Tests for: DELETE /places/:id
tape('DELETE /places/:id with id of something not in the database', t => {
  supertest(server)
    .delete('/places/507f1f77bcf86cd799439011')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'Message sent back')
      t.equal(res.body.message, 'Cannot find document to delete', 'Correct message is sent back')
      t.end()
    })
})

tape('DELETE /places/:id with good ID', t => {
  Place.create(validPlace1, validPlace2)
    .then(placeToBeDeleted => {
      supertest(server)
        .delete(`/places/${placeToBeDeleted.id}`)
        .expect(204)
        .end((err, res) => {
          if (err) t.fail(err)
          t.deepEqual(res.body, {}, 'Nothing returned after deletion')
          // check our database now has one fewer place
          Place.find()
            .then(placesAfterDeletion => {
              t.equal(placesAfterDeletion.length, 1, 'Places should now be length 1')
              t.ok(placesAfterDeletion[0].id !== placeToBeDeleted.id, 'deleted place should no longer be in the database')
              dropCollectionAndEnd(Place, t)
            })
            .catch(err => {
              t.fail(err)
              dropCollectionAndEnd(Place, t)
            })
        })
    })
    .catch(err => t.end(err))
})
