const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const User = require('../../src/models/User.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validUser1, validUser2, validBasicUser } = require('../fixtures/users.json')
const { auth } = require('../../src/constants/errors.json')
const roles = require('../../src/constants/roles.js')
const { addUserWithHashedPassword } = require('../helpers/index.js')
const { makeLoggedInToken } = require('../../src/controllers/session.js')

const validateJWT = require('../../src/middleware/validateJWT.js')
const validateUser = require('../../src/middleware/validateUser.js')
const checkRole = require('../../src/middleware/rolePermission.js')
const boomErrors = require('../../src/middleware/boomErrorHandler.js')

// dummy secure route to test on
server.get('/apps',
  validateJWT(),
  validateUser,
  checkRole({ minRole: roles.SUPER }),
  (req, res, next) => res.send('RESULTS')
)
server.use(boomErrors)

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
    t.equal(res.text, 'RESULTS', 'should return \'RESULTS\'')
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
