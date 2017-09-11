const { hasSufficientRole } = require('../../src/middleware/rolePermission.js')
const { validateUserAndAddId } = require('../../src/middleware/validateUser.js')
const { getToken } = require('../../src/middleware/validateJWT.js')
const roles = require('../../src/constants/roles.js')
const { auth } = require('../../src/constants/errors.json')
const { validUser1 } = require('../fixtures/users.json')
const User = require('../../src/models/User')

const tape = require('tape')

tape('test getToken function where req has token cookie', t => {
  const req = {
    cookies: {
      token: 'sometoken'
    }
  }
  t.equal(getToken(req), 'sometoken', 'token is returned')
  t.end()
})

tape('test getToken function where no token anywhere', t => {
  const req = {}
  t.equal(getToken(req), null, 'null is returned')
  t.end()
})

tape('hasSufficientRole with minSufficientRole SUPER, user role BASIC', t => {
  const opts = { minSufficientRole: roles.SUPER }
  const user = { role: roles.BASIC }
  t.notOk(hasSufficientRole(opts)(user), 'Unauthorized role returns false')
  t.end()
})

tape('hasSufficientRole with minSufficientRole SUPER, user role ADMIN', t => {
  const opts = { minSufficientRole: roles.SUPER }
  const user = { role: roles.ADMIN }
  t.notOk(hasSufficientRole(opts)(user), 'Unauthorized role returns false')
  t.end()
})

tape('hasSufficientRole with minSufficientRole SUPER, user role SUPER', t => {
  const opts = { minSufficientRole: roles.SUPER }
  const user = { role: roles.SUPER }
  t.ok(hasSufficientRole(opts)(user), 'Authorized role returns true')
  t.end()
})

tape('hasSufficientRole with minSufficientRole ADMIN, user role BASIC', t => {
  const opts = { minSufficientRole: roles.ADMIN }
  const user = { role: roles.BASIC }
  t.notOk(hasSufficientRole(opts)(user), 'Unauthorized role returns false')
  t.end()
})

tape('hasSufficientRole with minSufficientRole ADMIN, user role ADMIN', t => {
  const opts = { minSufficientRole: roles.ADMIN }
  const user = { role: roles.ADMIN }
  t.ok(hasSufficientRole(opts)(user), 'Authorized role returns true')
  t.end()
})

tape('hasSufficientRole with minSufficientRole ADMIN, user role SUPER', t => {
  const opts = { minSufficientRole: roles.ADMIN }
  const user = { role: roles.SUPER }
  t.ok(hasSufficientRole(opts)(user), 'Authorized role returns true')
  t.end()
})

tape('hasSufficientRole with minSufficientRole BASIC, user role BASIC', t => {
  const opts = { minSufficientRole: roles.BASIC }
  const user = { role: roles.BASIC }
  t.ok(hasSufficientRole(opts)(user), 'Authorized role returns true')
  t.end()
})

tape('hasSufficientRole with minSufficientRole BASIC, user role SUPER', t => {
  const opts = { minSufficientRole: roles.BASIC }
  const user = { role: roles.SUPER }
  t.ok(hasSufficientRole(opts)(user), 'Authorized role returns true')
  t.end()
})

tape('test validateUserAndAddId with non existant user', t => {
  const req = {
    user: {
      username: 'notreal'
    }
  }
  validateUserAndAddId(req)
    .catch(err => {
      t.ok(err, 'Non existant user is rejected')
      t.equal(err.message, auth.UNAUTHORIZED, 'Rejected with correct message')
      t.end()
    })
})

tape('test validateUserAndAddId with existant user', t => {
  const req = {
    user: {
      username: validUser1.username
    }
  }
  User.create(validUser1)
    .then((addedUser) => {
      validateUserAndAddId(req)
      .then(result => {
        t.equal(result.username, addedUser.username, 'returns req.user')
        t.ok(req.user.id, 'id has been attached to request object')
        t.equal(req.user.id, addedUser.id, 'correct id was added')
        t.end()
      })
    })
    .catch(err => t.end(err))
})
