const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server')

const boomErrorHandler = require('../../src/middleware/boomErrorHandler')
const fieldPermissions = require('../../src/middleware/fieldPermissions')
const validateHeaderToken = require('../../src/middleware/validateHeaderToken')
const { getUnauthorizedFields } = require('../../src/helpers/permissions')

const User = require('../../src/models/User.js')
const Event = require('../../src/models/Event.js')
const Token = require('../../src/models/auth/Token.js')

const { validAdminUser, validBasicUser } = require('../fixtures/users.json')
const { validEvent2 } = require('../fixtures/events.json')

const adminUserToken = { accessToken: '456' }
const basicUserToken = { accessToken: '123' }

const roles = require('../../src/constants/roles.js')

// 1) prepare the db

tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Event.remove({}),
    Token.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

// we will create a basic user, an admin user, an event owned by the admin user,
// and tokens to sign in either user

let adminUserId, basicUserId, eventId, adminToken, basicToken

tape('filling db.', t => {
  Promise.all([
    User.create(validBasicUser),
    User.create(validAdminUser)
  ])
  .then(([ basicUser, adminUser ]) => {
    basicUserId = basicUser.id
    adminUserId = adminUser.id
    validEvent2.owner = adminUserId
    adminUserToken.user = adminUserId
    basicUserToken.user = basicUserId
    return [ validEvent2, adminUserToken, basicUserToken ]
  })
  .then(([ validEvent2, adminUserToken, basicUserToken ]) => Promise.all([
    Event.create(validEvent2),
    Token.create(adminUserToken),
    Token.create(basicUserToken)
  ]))
  .then(([ event, adminUserToken, basicUserToken ]) => {
    adminToken = adminUserToken.accessToken
    basicToken = basicUserToken.accessToken
    eventId = event.id
  })
  .then(() => t.end())
  .catch(err => t.end(err))
})

// 2) add dummy routes for testing purposes

const testPermissions = {
  f1: [ roles.SUPER ],
  f2: [ roles.ADMIN ],
  f3: [ roles.BASIC ],
  f4: [ roles.SUPER, roles.OWNER ],
  f5: [ roles.ADMIN, roles.OWNER ],
  f6: [ roles.BASIC, roles.OWNER ]
}

// remove '/test' from req urls so fieldPermissions can get resource type from it
const urlSlice = (req, res, next) => {
  req.url = req.url.slice(5)
  next()
}

server.post('/test/events',
  validateHeaderToken,
  urlSlice,
  fieldPermissions(testPermissions),
  (req, res, next) => res.send('success!'),
  boomErrorHandler
)

server.put('/test/events/:id',
  validateHeaderToken,
  urlSlice,
  fieldPermissions(testPermissions),
  (req, res, next) => res.send('success!'),
  boomErrorHandler
)

// 3) integration tests for the middleware

tape('fieldPermissions PUT with no user', t => {
  supertest(server)
  .put(`/test/events/${eventId}`)
  .expect(401)
  .then(res => t.end())
  .catch(err => t.end(err))
})

tape('fieldPermissions PUT without editing any fields', t => {
  supertest(server)
  .put(`/test/events/${eventId}`)
  .set('Authorization', 'Bearer ' + adminToken)
  .expect(200)
  .then(res => t.end())
  .catch(err => t.end(err))
})

tape('fieldPermissions POST as basic user', t => {
  supertest(server)
  .post('/test/events')
  .set('Authorization', 'Bearer ' + basicToken)
  .send({
    f1: 'a',
    f2: 'a',
    f3: 'a',
    f4: 'a',
    f5: 'a',
    f6: 'a'
  })
  .expect(401)
  .then(res => {
    t.ok(
      ['f1', 'f2', 'f4', 'f5'].every(field => res.body.message.includes(field)),
      'message should list fields which are unauthorized')
    t.notOk(
      ['f3', 'f6'].some(field => res.body.message.includes(field)),
      'message should not list fields which are authorized')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('fieldPermissions PUT editing various fields, as admin user and owner', t => {
  supertest(server)
  .put(`/test/events/${eventId}`)
  .send({
    f1: 'a',
    f2: 'a',
    f3: 'a',
    f4: 'a',
    f5: 'a',
    f6: 'a'
  })
  .set('Authorization', 'Bearer ' + adminToken)
  .expect(401)
  .then(res => {
    // res.body should be a message including which fields are unauthorized
    t.ok(
      res.body.message.includes('f1'),
      'message should list fields which are unauthorized')
    t.notOk(
      ['f2', 'f3', 'f4', 'f5', 'f6'].some(field => res.body.message.includes(field)),
      'message should not list fields which are authorized')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('fieldPermissions PUT editing various fields, as basic user and not owner', t => {
  supertest(server)
  .put(`/test/events/${eventId}`)
  .send({
    f1: 'a',
    f2: 'a',
    f3: 'a',
    f4: 'a',
    f5: 'a',
    f6: 'a'
  })
  .set('Authorization', 'Bearer ' + basicToken)
  .expect(401)
  .then(res => {
    // res.body should be a message including which fields are unauthorized
    t.ok(
      ['f1', 'f2', 'f4', 'f5'].every(field => res.body.message.includes(field)),
      'message should list fields which are unauthorized')
    t.notOk(
      ['f3', 'f6'].some(field => res.body.message.includes(field)),
      'message should not list fields which are authorized')
    t.end()
  })
  .catch(err => t.end(err))
})

// 4) tests for individual functions

tape('test getUnauthorizedFields with no fields', t => {
  const user = {}
  const fieldPermissions = {}
  const fieldsToChange = []

  const unauthorizedFields =
    getUnauthorizedFields(fieldPermissions)(fieldsToChange)(user)

  t.equal(unauthorizedFields.length, 0, 'no unauthorized fields')
  t.end()
})

tape('test getUnauthorizedFields with varied fields', t => {
  const user = {
    role: roles.BASIC,
    isResourceOwner: true
  }
  const user2 = {
    role: roles.ADMIN
  }

  const fieldPermissions = {
    'f1': [ roles.SUPER ],
    'f2': [ roles.ADMIN ],
    'f3': [ roles.BASIC ],
    'f4': [ roles.SUPER, roles.OWNER ],
    'f5': [ roles.ADMIN, roles.OWNER ],
    'f6': [ roles.BASIC, roles.OWNER ]
  }
  const fieldsToChange = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6']

  const getFields =
    getUnauthorizedFields(fieldPermissions)(fieldsToChange)

  t.deepEqual(
    getFields(user),
    ['f1', 'f2'],
    'should return correct unauthorized fields for basic user who is resource owner'
  )

  t.deepEqual(
    getFields(user2),
    ['f1', 'f4'],
    'should return correct unauthorized fields for admin user'
  )
  t.end()
})

tape('fieldPermissions initialization with bad implementation', t => {
  try {
    fieldPermissions({
      id: [ roles.SUPER, roles.ADMIN ]
    })
    t.end('should throw bad implementation')
  } catch (err) {
    t.end()
  }
})

tape('fieldPermissions initialization', t => {
  try {
    fieldPermissions({
      id: [ roles.SUPER, roles.OWNER ],
      name: [ roles.BASIC ]
    })
    t.end()
  } catch (err) {
    t.end(err)
  }
})
