require('../config.js')
const tape = require('tape')
const dbConnection = require('../db/connect.js')
const server = require('../src/server.js')
const supertest = require('supertest')
const User = require('../db/models/User.js')
const testData = require('./fixtures/users.json')

dbConnection.once('open', () => {
  // require('./test_1.test.js')
  // require('./test_2.test.js')

  tape('Correct users returned', function (t) {
    supertest(server)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) t.fail(err)
        const expected = []
        const actual = res.body
        t.deepEqual(actual, expected, 'Initially return empty object')
        t.end()
      })
  })

  tape('/users successfully returns list of users when one has been added', t => {
    // add mock user to database using mongoose ORM
    const mockUser = new User(testData.a_user)
    mockUser.save()
      .then(() => {
        supertest(server)
        .get('/users')
        .expect(200)
        .end((err, res) => {
          if (err) t.fail(err)
          // check our get path returns that user correctly
          t.ok(res.body.length, 'response body should have length property')
          t.equal(res.body.length, 1, 'response body should be an array with length 1')
          t.equal(res.body[0].username, testData.a_user.username, 'correct username is returned')
          t.end()
        })
      })
      .catch(err => t.fail(err))
  })

  tape('check /users GET returns longer list', t => {
    const anotherUser = User(testData.another_user)
    anotherUser.save()
      .then(() => {
        supertest(server)
          .get('/users')
          .expect(200)
          .end((err, res) => {
            if (err) t.fail(err)
            // check our get path returns that user correctly
            t.equal(res.body.length, 2, 'response body should be an array with length 1')
            t.equal(res.body[0].username, testData.a_user.username, 'correct username is returned')
            t.equal(res.body[1].username, testData.another_user.username, 'correct username is returned')
            t.end()
          })
      })
      .catch(err => t.fail(err))
  })

  tape('testing adding user using POST requests to /users route', t => {
    const newUser = testData.third_user

    supertest(server)
      .post('/users')
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        if (err) t.fail(err)
        // check post request returns object that was added
        t.deepEqual(res.body, testData.third_user, 'New user object was returned')
        t.end()
      })
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
