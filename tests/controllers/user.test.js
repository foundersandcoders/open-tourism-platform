const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validUser1, validUser2, invalidUser1 } = require('../fixtures/users.json')

// Tests for: GET /users
tape('test /users when nothing in database', (t) => {
  supertest(server)
    .get('/users')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.length, 0, 'should initially return empty array')
      dropCollectionAndEnd(User, t)
    })
})

tape('test GET request to /users, with and without query parameters', t => {
  User.create(validUser1, validUser2)
    .then(() => {
      supertest(server)
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that user correctly
          t.equal(res.body.length, 2, 'response body should be an array with length 2')
          t.ok(res.body.map((user) => user.username).includes(validUser1.username), 'mattlub has been added')
          t.ok(res.body.map((user) => user.username).includes(validUser2.username), 'm4v15 has been added')
        })
      supertest(server)
        .get('/users?username=mattlub')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that user correctly
          t.equal(res.body.length, 1, 'query response body should be an array with length 1')
          t.equal(res.body[0].username, 'mattlub', 'results should be filtered correctly by url query parameters')
          dropCollectionAndEnd(User, t)
        })
    })
    .catch(err => t.end(err))
})

// GET /users/:id
tape('test /users/:id GET with id of something not in the database', (t) => {
  supertest(server)
    .get('/users/10')
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message.includes('Database error'), 'response message should contain "Database error"')
      dropCollectionAndEnd(User, t)
    })
})

tape('test /users/:id GET with id of something in the database', (t) => {
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

// Tests for: GET /users/:id

// Tests for: POST /users

tape('testing adding user using POST requests to /users route', t => {
  supertest(server)
    .post('/users')
    .send(validUser1)
    .expect(201)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
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
})

tape('testing adding user using POST requests to /users route', t => {
  supertest(server)
    .post('/users')
    .send(invalidUser1)
    .expect(500)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      t.ok(res.body.message.includes('Database error'), 'Correct message is sent back')
      dropCollectionAndEnd(User, t)
    })
})

// Tests for: PUT /users/:id
tape('test PUT request to /users/:id with id of something not in the database', (t) => {
  supertest(server)
    .put('/users/invalidId')
    .send(validUser1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message.includes('Database error'), 'error message should contain "Database error"')
      dropCollectionAndEnd(User, t)
    })
})

tape('test PUT request to /users/:id with valid id and valid new user data', (t) => {
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

tape('test /users/:id DELETE returns error with wrong ID', t => {
  supertest(server)
    .delete('/users/123456789')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'Message sent back')
      t.ok(res.body.message.includes('Bad Request'), 'Correct message sent back')
      t.end()
    })
})

tape('test /users/:id DELETE with good ID', t => {
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
