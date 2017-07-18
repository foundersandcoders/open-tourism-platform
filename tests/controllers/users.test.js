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
// tape('test PUT request to /users/:id with id of something not in the database', (t) => {
//   supertest(server)
//     .put('/users/invalidId')
//     .send(validUser1)
//     .expect(400)
//     .expect('Content-Type', /json/)
//     .end((err, res) => {
//       if (err) t.fail(err)

//       dropCollectionAndEnd(User, t)
//     })
// })

// tape('test PUT request to /users/:id with valid id and valid new user data', (t) => {
//   User.create(validUser1)
//     .then(createdUser => {
//       supertest(server)
//         .put(`/users/${createdUser.id}`)
//         .send(validUser1)
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           if (err) t.fail(err)
//           t.equal(res.body.username, validUser1.username, 'should get user with correct username.')
//           dropCollectionAndEnd(User, t)
//         })
//     })
//     .catch(err => t.end(err))
// })

// Tests for: DELETE /users/:id
