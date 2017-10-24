const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')

const { auth: authErrMessages } = require('../../src/constants/errors')

const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validUser1, validUser2, invalidUser1, validAdminUser } = require('../fixtures/users.json')

const { makeLoggedInToken } = require('../../src/controllers/session.js')

// Tests for: GET /users
tape('GET /users when not logged in', t => {
  supertest(server)
    .get('/api/v1/users')
    .expect(401)
    .expect('Content-Type', /json/)
    .then(res => {
      t.equal(res.body.message, authErrMessages.UNAUTHORIZED, 'unauthorised error message sent')
      t.end()
    })
    .catch(err => t.end(err))
})

tape('GET /users, when logged in, without query parameters', t => {
  Promise.all([
    User.create(validUser1),
    User.create(validUser2),
    makeLoggedInToken(validUser1)
  ])
  .then(([user1, user2, token]) => {
    return supertest(server)
      .get('/api/v1/users')
      .expect(200)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    // check our get path returns that user correctly
    t.equal(res.body.length, 2, 'response body should be an array with length 2')
    t.ok(res.body.map((user) => user.username).includes(validUser1.username), 'mattlub has been added')
    t.ok(res.body.map((user) => user.username).includes(validUser2.username), 'm4v15 has been added')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('GET /users, when logged in, with query parameters', t => {
  Promise.all([
    User.create(validUser1),
    User.create(validUser2),
    makeLoggedInToken(validUser1)
  ])
  .then(([user1, user2, token]) => {
    return supertest(server)
      .get('/api/v1/users?username=mattlub')
      .expect(200)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    // check our get path returns that user correctly
    t.equal(res.body.length, 1, 'query response body should be an array with length 1')
    t.equal(res.body[0].username, 'mattlub', 'results should be filtered correctly by url query parameters')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

// GET /users/:id
tape('GET /users/:id when not logged in', t => {
  supertest(server)
    .get('/api/v1/users/507f1f77bcf86cd799439011')
    .expect(401)
    .expect('Content-Type', /json/)
    .then(res => {
      t.equal(res.body.message, authErrMessages.UNAUTHORIZED, 'unauthorised error message sent')
      t.end()
    })
    .catch(err => t.end(err))
})

tape('GET /users/:id with valid id of something not in the database', t => {
  Promise.all([
    User.create(validUser1),
    makeLoggedInToken(validUser1)
  ])
  .then(([user1, token]) => {
    return supertest(server)
      .get('/api/v1/users/507f1f77bcf86cd799439011')
      .expect(404)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    // check our get path returns that user correctly
    t.equal(res.body.message, 'No document matching that id', 'response message is correct')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('GET /users/:id with id of logged in user (i.e. as the owner)', t => {
  Promise.all([
    User.create(validUser1),
    makeLoggedInToken(validUser1)
  ])
  .then(([user1, token]) => {
    return supertest(server)
      .get(`/api/v1/users/${user1.id}`)
      .expect(200)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    // check our get path returns that user correctly
    t.equal(res.body.username, validUser1.username, 'should get user with correct username.')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('GET /users/:id with id of not the logged in user (i.e. as not owner)', t => {
  Promise.all([
    User.create(validUser1),
    User.create(validAdminUser),
    makeLoggedInToken(validAdminUser)
  ])
  .then(([user1, userAdmin, token]) => {
    return supertest(server)
      .get(`/api/v1/users/${user1.id}`)
      .expect(401)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, authErrMessages.UNAUTHORIZED, 'unauthorised error message sent')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

// Tests for: POST /users
tape('POST /users adding user with authorised role (super)', t => {
  Promise.all([
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user2, token]) => {
    return supertest(server)
      .post('/api/v1/users')
      .send(validUser1)
      .expect(201)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.username, validUser1.username, 'Correct object is added')
    t.ok(res.body._id && res.body.createdAt && res.body.updatedAt, 'id and timestamp fields added')
    // Now check whether it is in the database
    return User.findById(res.body._id)
  })
  .then(user => {
    t.equal(user.email, validUser1.email, 'User is in the database')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

// Tests for: POST /users
tape('POST /users adding user with unauthorised role (admin)', t => {
  Promise.all([
    User.create(validAdminUser),
    makeLoggedInToken(validAdminUser)
  ])
  .then(([userAdmin, token]) => {
    return supertest(server)
      .post('/api/v1/users')
      .send(validUser1)
      .set('Cookie', `token=${token}`)
      .expect(401)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, authErrMessages.UNAUTHORIZED, 'unauthorised error message sent')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('POST /users adding invalid user', t => {
  Promise.all([
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user2, token]) => {
    return supertest(server)
      .post('/api/v1/users')
      .send(invalidUser1)
      .expect(400)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, 'Validation Failed', 'Correct message is sent back')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('POST /users/ with user violating unique username constraint', t => {
  Promise.all([
    User.create(validUser1),
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user1, user2, token]) => {
    return supertest(server)
      .post('/api/v1/users')
      .send(validUser1)
      .expect(400)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, 'Data violates unique constraints validation', 'Correct message is sent back')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

// Tests for: PUT /users/:id
tape('PUT /users/:id with invalid id', t => {
  Promise.all([
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user2, token]) => {
    return supertest(server)
      .put('/api/v1/users/invalidid')
      .send(validUser1)
      .expect(400)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
    dropCollectionAndEnd(User, t)
  })
})

tape('PUT /users/:id with id of something not in the database', t => {
  Promise.all([
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user2, token]) => {
    return supertest(server)
      .put('/api/v1/users/507f1f77bcf86cd799439014')
      .send(validUser1)
      .expect(400)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, 'Cannot find document to update', 'Correct message is sent back')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('PUT /users/:id with valid id and valid new user data', t => {
  Promise.all([
    User.create(validUser1),
    makeLoggedInToken(validUser1)
  ])
  .then(([user1, token]) => {
    return supertest(server)
      .put(`/api/v1/users/${user1.id}`)
      .send(validUser2)
      .expect(200)
      .expect('Content-Type', /json/)
      .set('Cookie', `token=${token}`)
  })
  .then(res => {
    t.equal(res.body.username, validUser2.username, 'user should be correctly updated, and the updated user returned')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

// Tests for: DELETE /users/:id
tape('DELETE /users/:id with invalid id', t => {
  Promise.all([
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user2, token]) => {
    return supertest(server)
      .delete('/api/v1/users/invalidid')
      .expect(400)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('DELETE /users/:id returns error with id of something not in the database', t => {
  Promise.all([
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user2, token]) => {
    return supertest(server)
      .delete('/api/v1/users/507f1f77bcf86cd799439014')
      .expect(400)
      .set('Cookie', `token=${token}`)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.message, 'Cannot find document to delete', 'Correct message is sent back')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('DELETE /users/:id with good ID', t => {
  Promise.all([
    User.create(validUser1),
    User.create(validUser2),
    makeLoggedInToken(validUser2)
  ])
  .then(([user1, user2, token]) => {
    return supertest(server)
      .delete(`/api/v1/users/${user1.id}`)
      .expect(204)
      .set('Cookie', `token=${token}`)
  })
  .then((res) => {
    t.deepEqual(res.body, {}, 'Nothing returned after deletion')
    return User.find()
  })
  .then(users => {
    t.equal(users.length, 1, 'Users should now be length 1')
    t.equal(users[0].username, validUser2.username, 'Correct user has been deleted')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})
