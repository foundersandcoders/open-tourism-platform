const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validUser1, validUser2, invalidUser1, validAdminUser } = require('../fixtures/users.json')

const { makeLoggedInToken } = require('../../src/controllers/session.js')

// Tests for: GET /users
tape('GET /users when not logged in', t => {
  supertest(server)
    .get('/users')
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.pass('Denied access')
      t.end()
    })
})

tape('GET /users, when logged in, without query parameters', t => {
  User.create(validUser1, validUser2)
    .then(() => makeLoggedInToken(validUser1))
    .then((token) => {
      return supertest(server)
        .get('/users')
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
  User.create(validUser1, validUser2)
    .then(() => makeLoggedInToken(validUser1))
    .then((token) => {
      return supertest(server)
        .get('/users?username=mattlub')
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
tape('GET /users/:id with valid id of something not in the database', t => {
  supertest(server)
    .get('/users/507f1f77bcf86cd799439011')
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'No document matching that id', 'response message is correct')
      dropCollectionAndEnd(User, t)
    })
})

tape('GET /users/:id with id of something in the database', t => {
  User.create(validUser1)
    .then(result => {
      supertest(server)
        .get(`/users/${result.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.username, validUser1.username, 'should get user with correct username.')
          dropCollectionAndEnd(User, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /users
tape('POST /users adding user with authorised role (super)', t => {
  User.create(validUser2)
    .then(() => makeLoggedInToken(validUser2))
    .then((token) => {
      return supertest(server)
        .post('/users')
        .send(validUser1)
        .expect(201)
        .set('Cookie', `token=${token}`)
        .expect('Content-Type', /json/)
    })
    .then(res => {
      t.equal(res.body.username, validUser1.username, 'Correct object is added')
      t.ok(res.body._id && res.body.createdAt && res.body.updatedAt, 'id and timestamp fields added')
      // Now check whether it is in the database
      User.findById(res.body._id)
        .then(user => {
          t.equal(user.email, res.body.email, 'User is in the database')
          dropCollectionAndEnd(User, t)
        })
        .catch(err => {
          t.fail(err)
          dropCollectionAndEnd(User, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /users
tape('POST /users adding user with unauthorised role (admin)', t => {
  User.create(validAdminUser)
    .then(() => makeLoggedInToken(validAdminUser))
    .then((token) => {
      return supertest(server)
        .post('/users')
        .send(validUser1)
        .set('Cookie', `token=${token}`)
        .expect(401)
        .expect('Content-Type', /json/)
    })
    .then(res => {
      t.pass('Denied access')
      t.end()
    })
    .catch(err => t.end(err))
})

tape('POST /users adding invalid user', t => {
  User.create(validUser2)
    .then(() => makeLoggedInToken(validUser2))
    .then((token) => {
      return supertest(server)
        .post('/users')
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
  User.create(validUser1, validUser2)
    .then(() => makeLoggedInToken(validUser2))
    .then((token) => {
      return supertest(server)
        .post('/users')
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
  supertest(server)
    .put('/users/invalidid')
    .send(validUser1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
      dropCollectionAndEnd(User, t)
    })
})

tape('PUT /users/:id with id of something not in the database', t => {
  supertest(server)
    .put('/users/507f1f77bcf86cd799439011')
    .send(validUser1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'Cannot find document to update', 'Correct message is sent back')
      dropCollectionAndEnd(User, t)
    })
})

tape('PUT /users/:id with valid id and valid new user data', t => {
  User.create(validUser1)
    .then(createdUser => {
      supertest(server)
        .put(`/users/${createdUser.id}`)
        .send(validUser2)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.username, validUser2.username, 'user should be correctly updated, and the updated user returned')
          dropCollectionAndEnd(User, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: DELETE /users/:id
tape('DELETE /users/:id with invalid id', t => {
  supertest(server)
    .delete('/users/invalid')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'Message sent back')
      t.equal(res.body.message, 'Invalid id', 'Correct message is sent back')
      t.end()
    })
})

tape('DELETE /users/:id returns error with id of something not in the database', t => {
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

tape('DELETE /users/:id with good ID', t => {
  User.create(validUser1, validUser2)
    .then(addedUser => {
      supertest(server)
        .delete(`/users/${addedUser.id}`)
        .expect(204)
        .end((err, res) => {
          if (err) t.fail(err)
          t.deepEqual(res.body, {}, 'Nothing returned after deletion')
          // check our database now has one fewer user
          User.find()
            .then(users => {
              t.equal(users.length, 1, 'Users should now be length 1')
              dropCollectionAndEnd(User, t)
            })
        })
    })
    .catch(err => t.end(err))
})
