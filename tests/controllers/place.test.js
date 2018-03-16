const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Place = require('../../src/models/Place.js')
const User = require('../../src/models/User.js')
const Token = require('../../src/models/auth/Token.js')

const { auth: authErrMessages, messages: errMessages } = require('../../src/constants/errors')

const { validPlace1, validPlace2, validPlace3, invalidPlace1 } = require('../fixtures/places.json')
const { validAdminUser, user, superUser, validBasicUser } = require('../fixtures/users.json')
const { token } = require('../fixtures/auth/tokens.json')

const { dropCollectionAndEnd, dropCollectionsAndEnd } = require('../helpers/index.js')

const { makeLoggedInToken } = require('../../src/controllers/session.js')

tape('emptying test db.', t => {
  Promise.all([
    User.remove({}),
    Place.remove({}),
    Token.remove({})
  ])
    .then(() => t.end())
    .catch(err => t.end(err))
})

// Tests for: GET /places
tape('GET /places when nothing in database', t => {
  supertest(server)
    .get('/api/v1/places')
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
        .get('/api/v1/places')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that place correctly
          t.equal(res.body.length, 2, 'response body should be an array with length 2')
          t.ok(res.body.map(place => place.en.name).includes(validPlace1.en.name), 'first place has been added')
          t.ok(res.body.map(place => place.en.name).includes(validPlace2.en.name), 'second place has been added')
        })
      supertest(server)
        .get('/api/v1/places?en.name=Basilica')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that place correctly
          t.equal(res.body.length, 1, 'filtered response body should be an array with length 1')
          t.equal(res.body[0].en.name, 'Basilica', 'results should be filtered correctly by url query parameters')
          dropCollectionAndEnd(Place, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /places/:id
tape('GET /places/:id with invalid id', t => {
  supertest(server)
    .get('/api/v1/places/10')
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
        .get(`/api/v1/places/${result.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.en.name, validPlace1.en.name, 'should get place with correct name.')
          dropCollectionAndEnd(Place, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /places
tape('POST /places with valid place data', t => {
  Promise.all([
    User.create([validBasicUser, superUser]), // superUser for sending emails
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) => supertest(server)
    .post('/api/v1/places')
    .set('Cookie', `token=${token}`)
    .send(validPlace1)
    .expect(201)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.equal(res.body.en.name, validPlace1.en.name, 'Correct object is added')
      t.ok(res.body._id && res.body.createdAt && res.body.updatedAt, 'id and timestamp fields added')
      // Now check whether it is in the database
      Place.findById(res.body._id)
        .then(place => {
          t.equal(place.en.name, res.body.en.name, 'Place is in the database')
          dropCollectionsAndEnd([Place, User], t)
        })
        .catch(err => {
          t.fail(err)
          dropCollectionsAndEnd([Place, User], t)
        })
    }).catch(err => t.end(err))
})

tape('POST /places with invalid place data', t => {
  Promise.all([
    User.create(validBasicUser),
    makeLoggedInToken(validBasicUser)
  ]).then(([ _, token ]) =>
  supertest(server)
    .post('/api/v1/places')
    .set('Cookie', `token=${token}`)
    .send(invalidPlace1)
    .expect(400)
    .expect('Content-Type', /json/)
    ).then(res => {
      t.ok(res.body.message, 'A message is sent back')
      t.equal(res.body.message, 'Validation Failed', 'Correct message is sent back')
      dropCollectionsAndEnd([Place, User], t)
    }).catch(err => t.end(err))
})

// Tests for: PUT /places/:id
tape('PUT /places/:id unauthorized as not logged in', t => {
  return supertest(server)
    .put('/api/v1/places/507f1f77bcf86cd799439011')
    .expect(401)
    .expect('Content-Type', /json/)
  .then(res => {
    t.equal(
      res.body.message,
      authErrMessages.UNAUTHORIZED,
      'should return unauthorized error message')
    t.end()
  })
   .catch(err => t.end(err))
})

tape('PUT /places/:id with id of something not in the database, logged in directly as SUPER', t => {
  Promise.all([
    User.create(superUser),
    makeLoggedInToken(superUser)
  ])
  .then(([user, token]) => {
    return supertest(server)
      .put('/api/v1/places/507f1f77bcf86cd799439011')
      .set('Cookie', `token=${token}`)
      .send(validPlace1)
      .expect(404)
      .expect('Content-Type', /json/)
  .then(res => {
    t.equal(res.body.message, 'No document matching that id', 'Correct message is sent back')
    dropCollectionsAndEnd([Place, User], t)
  })
  .catch(error => t.end(error))
  })
})

tape('PUT /places/:id with valid id and valid new place data logged in directly as admin', t => {
  Promise.all([
    Place.create(validPlace1),
    User.create(validAdminUser),
    makeLoggedInToken(validAdminUser)
  ])
  .then(([place, admin, token]) => {
    return supertest(server)
      .put(`/api/v1/places/${place.id}`)
      .set('Cookie', `token=${token}`)
      .send(validPlace2)
      .expect(200)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.en.name, validPlace2.en.name, 'place should be correctly updated, and the updated place returned')
    // check place was updated in db
    return Place.findById(res.body._id)
  })
  .then(newPlace => {
    t.equal(newPlace.en.name, validPlace2.en.name, 'Place has been updated in the database')
    dropCollectionsAndEnd([Place, User], t)
  })
  .catch(err => t.end(err))
})

tape('PUT /places/:id with valid id and valid new place data logged in directly as admin, but trying to update unauthorized field (id)', t => {
  Promise.all([
    Place.create(validPlace1),
    User.create(validAdminUser),
    makeLoggedInToken(validAdminUser)
  ])
  .then(([place, admin, token]) => {
    return supertest(server)
      .put(`/api/v1/places/${place.id}`)
      .set('Cookie', `token=${token}`)
      .send(validPlace3)
      .expect(401)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(
      res.body.message,
      `${errMessages.FIELD_UNAUTHORIZED}_id`,
      'should return unauthorized error message')
    dropCollectionsAndEnd([Place, User], t)
  })
   .catch(err => t.end(err))
})

// Tests for: DELETE /places/:id
tape('DELETE /places/:id with id of something not in the database logged in as SUPER OAuth', t => {
  Promise.all([
    User.create(superUser),
    Token.create(token)
  ])
  .then(([userSuper, authToken]) => {
    return supertest(server)
    .delete('/api/v1/places/507f1f77bcf86cd799439011')
    .set('Authorization', 'Bearer ' + authToken.accessToken)
    .expect(400)
    .expect('Content-Type', /json/)
  })
  .then(res => {
    t.ok(res.body.message, 'Message sent back')
    t.equal(res.body.message, 'Cannot find document to delete', 'Correct message is sent back')
    dropCollectionsAndEnd([User, Token], t)
  })
  .catch(err => t.end(err))
})

tape('DELETE /places/:id with good ID, logged in as owner via OAuth', t => {
  Promise.all([
    Place.create(validPlace1),
    Place.create(validPlace3),
    User.create(user),
    Token.create(token)
  ])
  .then(([place, placeToBeDeleted, userBasic, authToken]) => {
    return supertest(server)
    .delete(`/api/v1/places/${placeToBeDeleted._id}`)
    .set('Authorization', 'Bearer ' + authToken.accessToken)
    .expect(204)
  })
  .then(res => {
    t.deepEqual(res.body, {}, 'Nothing returned after deletion')
    return Place.find()
  })
  .then(placesAfterDeletion => {
    t.equal(placesAfterDeletion.length, 1, 'Places should now be length 1')
    t.ok(placesAfterDeletion[0].id !== validPlace3.id, 'deleted place should no longer be in the database')
    dropCollectionsAndEnd([Place, User, Token], t)
  })
  .catch(err => t.end(err))
})
