require('../config.js')
const tape = require('tape')
const dbConnection = require('../db/connect.js')
const server = require('../src/server.js')
const supertest = require('supertest')
const User = require('../db/models/User.js')

dbConnection.once('open', () => {
  // require('./test_1.test.js')
  // require('./test_2.test.js')

  tape('Correct users returned', function (t) {
    supertest(server)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) t.fail(err)
        const expected = []
        const actual = res.body
        t.deepEqual(actual, expected, 'Initially return empty object')
        t.end()
      })
  })

  tape('/users successfully returns list of users when one has been added', t => {
    const mockUser = new User({
      username: 'mattlub',
      password: 'pword',
      name: 'matt',
      email: 'xxx',
      role: 'SUPER',
      isPublic: false
    })

    mockUser.save()
      .then(() => {
        supertest(server)
        .get('/users')
        .expect(200)
        .end(function (err, res) {
          if (err) t.fail(err)
          t.ok(res.body.length, 'response body should have length property')
          t.equal(res.body.length, 1, 'response body should be an array with length 1')
          t.end()
        })
      })
      .catch(err => t.fail(err))
  })

  tape.onFinish(() => {
    // clear collection
    User.collection.drop()
    .then(() => {
      dbConnection.close()
    })
    .catch(err => console.log(err))

  })
})

dbConnection.on('error', err => {
  throw err
})
