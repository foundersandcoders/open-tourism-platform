require('../config.js')
const tape = require('tape')
const dbConnection = require('../db/connect.js')
const server = require('../src/server.js')
const supertest = require('supertest')
const User = require('../db/models/User.js')
const testData = require('./fixtures/users.json')

// function to drop collection and end the tests
const dropCollectionAndEnd = (myCollection, t) => {
  myCollection.collection.drop()
    .then(() => {
      t.end()
    })
    .catch(err => t.end(err))
}

dbConnection.once('open', () => {
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

  tape('test /users when one user in database', t => {
    // add mock user to database using mongoose ORM
    const mockUser = new User(testData.a_user)
    mockUser.save()
      .then(() => {
        supertest(server)
          .get('/users')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) t.fail(err)
            // check our get path returns that user correctly
            t.ok(res.body.length, 'response body should have length property')
            t.equal(res.body.length, 1, 'response body should be an array with length 1')
            t.equal(res.body[0].username, testData.a_user.username, 'correct username is returned')
            dropCollectionAndEnd(User, t)
          })
      })
      .catch(err => t.end(err))
  })

  tape('test /users GET returns longer list', t => {
    User.create(testData.a_user, testData.another_user)
      .then(() => {
        supertest(server)
          .get('/users')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) t.fail(err)
            // check our get path returns that user correctly
            t.equal(res.body.length, 2, 'response body should be an array with length 1')
            t.equal(res.body[0].username, testData.a_user.username, 'correct username is returned')
            t.equal(res.body[1].username, testData.another_user.username, 'correct username is returned')
            dropCollectionAndEnd(User, t)
          })
      })
      .catch(err => t.end(err))
  })

  tape.onFinish(() => {
    dbConnection.close()
  })
})

dbConnection.on('error', err => {
  throw err
})
