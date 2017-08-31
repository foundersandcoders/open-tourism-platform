const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')
const jwt = require('jsonwebtoken')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validUser1, validUser2, validBasicUser, regUser } = require('../fixtures/users.json')
const { auth } = require('../../src/constants/errors.json')
const roles = require('../../src/constants/roles.js')
const { addUserWithHashedPassword } = require('../helpers/index.js')
const { makeLoggedInToken } = require('../../src/controllers/session.js')

// set of tests to check a token
const testToken = (t, token, user, role) => {
  const verified = jwt.verify(token, process.env.JWT_SECRET)
  t.ok(verified, 'token is verified')
  t.equal(verified.username, user.username, 'Username matches')
  t.equal(verified.role, role, 'role is correct')
  t.equal(verified.exp - verified.iat, 3600, 'token lasts 1hr')
}

tape('test makeLoggedInToken function', t => {
  makeLoggedInToken(validUser1)
  .then(token => {
    testToken(t, token, validUser1, validUser1.role)
    t.end()
  })
})

tape('POST /register with new user', t => {
  supertest(server)
    .post('/register')
    .send(regUser)
    .expect(200)
    .expect('Content-Type', /text/)
    .then(res => {
      t.equal(res.text, 'registered!', 'should return \'registered!\'')
      t.ok(res.headers['set-cookie'], 'set cookie header exists')
      t.ok(res.headers['set-cookie'][0].includes('token'), 'Cookie header contains token')
      // extract the token from the header
      const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0]
      // running synchronously here to avoid messy test
      testToken(t, token, regUser, roles.BASIC)
      dropCollectionAndEnd(User, t)
    })
    .catch(t.end)
})

tape('POST /login with validUser1', t => {
  addUserWithHashedPassword(validUser1)
  .then(() => supertest(server)
    .post('/login')
    .send({ username: validUser1.username, password: validUser1.password })
    .expect(200)
    .expect('Content-Type', /text/)
  )
  .then(res => {
    t.equal(res.text, 'success', 'should return \'success\'')
    t.ok(res.headers['set-cookie'], 'set cookie header exists')
    t.ok(res.headers['set-cookie'][0].includes('token'), 'Cookie header contains token')
    const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0]
    testToken(t, token, validUser1, validUser1.role)
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('POST /login with wrong password', t => {
  addUserWithHashedPassword(validUser1)
  .then(() => supertest(server)
    .post('/login')
    .send({ username: validUser1.username, password: 'WRONG' })
    .expect(400)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.message, auth.WRONGUSERORPW, 'Correct error message returned')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('POST /login with wrong username', t => {
  addUserWithHashedPassword(validUser1)
  .then(() => supertest(server)
    .post('/login')
    .send({ username: 'm4v15', password: validUser1.password })
    .expect(400)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.message, auth.WRONGUSERORPW, 'Correct error message returned')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('POST /apps with validToken', t => {
  addUserWithHashedPassword(validUser1)
  .then(() => makeLoggedInToken(validUser1))
  .then(token => supertest(server)
    .get('/apps')
    .set('Cookie', `token=${token}`)
    .expect(200)
    .expect('Content-Type', /text/)
  )
  .then(res => {
    t.equal(res.text, 'Here are you apps', 'should return \'Here are you apps\'')
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('POST /apps with invalidToken (of a non-existent user)', t => {
  addUserWithHashedPassword(validUser1)
  .then(() => makeLoggedInToken(validUser2))
  .then(token => supertest(server)
    .get('/apps')
    .set('Cookie', `token=${token}`)
    .expect(401)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.error, 'Unauthorized', 'Unauthorised error returned')
    t.equal(res.body.message, auth.UNAUTHORIZED, `'${auth.UNAUTHORIZED}' is returned as error message`)
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})

tape('POST /apps with validToken, unauthorized role', t => {
  addUserWithHashedPassword(validBasicUser)
  .then(() => makeLoggedInToken(validBasicUser))
  .then(token => supertest(server)
    .get('/apps')
    .set('Cookie', `token=${token}`)
    .expect(401)
    .expect('Content-Type', /json/)
  )
  .then(res => {
    t.equal(res.body.error, 'Unauthorized', 'Unauthorised error returned')
    t.equal(res.body.message, auth.UNAUTHORIZED, `'${auth.UNAUTHORIZED}' is returned as error message`)
    dropCollectionAndEnd(User, t)
  })
  .catch(err => t.end(err))
})
