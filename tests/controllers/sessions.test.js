const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { regUser, logIn } = require('../fixtures/users.json')
const { auth } = require('../../src/constants/errors.json')
const roles = require('../../src/constants/roles.js')

tape('POST /register with new user', t => {
  supertest(server)
    .post('/register')
    .send(regUser)
    .expect(200)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.text, 'registered!', 'should return \'registered!\'')
      dropCollectionAndEnd(User, t)
    })
})

tape('POST /register with new user and then log in', t => {
  // register user before logging in as that user
  supertest(server)
    .post('/register')
    .send(regUser)
    .expect(200)
    .expect('Content-Type', /text/)
    .end((err, response) => {
      if (err) t.fail(err)
      supertest(server)
        .post('/login')
        .send(logIn)
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.text, 'success', 'should return \'success\'')
          t.ok(res.headers['set-cookie'], 'set cookie header exists')
          t.ok(res.headers['set-cookie'][0].includes('token'), 'Cookie header contains token')
          dropCollectionAndEnd(User, t)
        })
    })
})

tape('GET SUPER secure route /app with unauthorized user', t => {
  // register new user
  supertest(server)
    .post('/register')
    .send(regUser)
    .expect(200)
    .expect('Content-Type', /text/)
    .end((err, registeredRes) => {
      if (err) t.fail(err)
      // log in to get token
      supertest(server)
        .post('/login')
        .send(logIn)
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, loggedInRes) => {
          if (err) t.fail(err)
          // attempt to use token to access secure route
          supertest(server)
            .get('/apps')
            .set('Cookie', loggedInRes.header['set-cookie'][0])
            .expect(401)
            .end((err, secureRes) => {
              if (err) t.fail(err)
              t.equal(secureRes.body.error, 'Unauthorized', 'Unauthorised error returned')
              t.equal(secureRes.body.message, auth.UNAUTHORIZED, `'${auth.UNAUTHORIZED}' is returned as error message`)
              dropCollectionAndEnd(User, t)
            })
        })
    })
})

tape('GET SUPER secure route /app with authorized user', t => {
  // register new user
  supertest(server)
    .post('/register')
    .send(regUser)
    .expect(200)
    .expect('Content-Type', /text/)
    .end((err, registeredRes) => {
      if (err) t.fail(err)
      // manually update user to have SUPER role
      User.update({ username: regUser.username }, {role: roles.SUPER})
        .then(() => {
          // log in to get a token
          supertest(server)
            .post('/login')
            .send(logIn)
            .expect(200)
            .expect('Content-Type', /text/)
            .end((err, loggedInRes) => {
              if (err) t.fail(err)
              // use token to try and access secure route
              supertest(server)
                .get('/apps')
                .set('Cookie', loggedInRes.header['set-cookie'][0])
                .expect(200)
                .expect('Content-Type', /text/)
                .end((err, secureRes) => {
                  if (err) t.fail(err)
                  t.equal(secureRes.text, 'IN!', '\'IN!\' sent back as a response')
                  dropCollectionAndEnd(User, t)
                })
            })
        })
        .catch(err => t.end(err))
    })
})
