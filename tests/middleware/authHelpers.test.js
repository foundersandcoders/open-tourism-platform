const { rolePermissionIsSufficient } = require('../../src/middleware/rolePermission.js')
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

tape('rolePermissionIsSufficient with minRole SUPER, user role BASIC', t => {
  const minRole = { minRole: roles.SUPER }
  const user = { role: roles.BASIC }
  t.notOk(rolePermissionIsSufficient(minRole)(user), 'Unauthorized role returns false')
  t.end()
})

tape('rolePermissionIsSufficient with minRole SUPER, user role ADMIN', t => {
  const minRole = { minRole: roles.SUPER }
  const user = { role: roles.ADMIN }
  t.notOk(rolePermissionIsSufficient(minRole)(user), 'Unauthorized role returns false')
  t.end()
})

tape('rolePermissionIsSufficient with minRole SUPER, user role SUPER', t => {
  const minRole = { minRole: roles.SUPER }
  const user = { role: roles.SUPER }
  t.ok(rolePermissionIsSufficient(minRole)(user), 'Authorized role returns true')
  t.end()
})

tape('rolePermissionIsSufficient with minRole ADMIN, user role BASIC', t => {
  const minRole = { minRole: roles.ADMIN }
  const user = { role: roles.BASIC }
  t.notOk(rolePermissionIsSufficient(minRole)(user), 'Unauthorized role returns false')
  t.end()
})

tape('rolePermissionIsSufficient with minRole ADMIN, user role ADMIN', t => {
  const minRole = { minRole: roles.ADMIN }
  const user = { role: roles.ADMIN }
  t.ok(rolePermissionIsSufficient(minRole)(user), 'Authorized role returns true')
  t.end()
})

tape('rolePermissionIsSufficient with minRole ADMIN, user role SUPER', t => {
  const minRole = { minRole: roles.ADMIN }
  const user = { role: roles.SUPER }
  t.ok(rolePermissionIsSufficient(minRole)(user), 'Authorized role returns true')
  t.end()
})

tape('rolePermissionIsSufficient with minRole BASIC, user role BASIC', t => {
  const minRole = { minRole: roles.BASIC }
  const user = { role: roles.BASIC }
  t.ok(rolePermissionIsSufficient(minRole)(user), 'Authorized role returns true')
  t.end()
})

tape('rolePermissionIsSufficient with minRole BASIC, user role SUPER', t => {
  const minRole = { minRole: roles.BASIC }
  const user = { role: roles.SUPER }
  t.ok(rolePermissionIsSufficient(minRole)(user), 'Authorized role returns true')
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
