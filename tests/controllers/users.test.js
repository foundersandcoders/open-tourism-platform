const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validUser1, validUser2 } = require('../fixtures/users.json')

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

tape('test /users GET returns list of users', t => {
  User.create(validUser1, validUser2)
    .then(() => {
      supertest(server)
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that user correctly
          t.equal(res.body.length, 2, 'response body should be an array with length 1')
          t.ok(res.body.map((user) => user.username).includes(validUser1.username), 'mattlub has been added')
          t.ok(res.body.map((user) => user.username).includes(validUser2.username), 'm4v15 has been added')
          dropCollectionAndEnd(User, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /users/:id

// Tests for: POST /users

// Tests for: PUT /users/:id

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
    .then((addedUser) => {
      supertest(server)
        .delete(`/users/${addedUser.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.name, addedUser.name, 'response body should be the user that has been removed')
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
