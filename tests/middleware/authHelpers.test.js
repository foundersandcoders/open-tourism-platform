const { getToken, verifyRole, addUserIdToSession } = require('../../src/middleware/authHelpers.js')
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

tape('test verifyRole with minRole SUPER, user scope BASIC', t => {
  const minRole = { minRole: roles.SUPER }
  const scope = { scope: roles.BASIC }
  verifyRole(minRole)(scope)
    .catch(err => {
      t.ok(err, 'Unauthorized scope is rejected')
      t.equal(err.message, auth.UNAUTHORIZED, 'Unauthorized rejected with correct message')
      t.end()
    })
})

tape('test verifyRole with minRole SUPER, user scope ADMIN', t => {
  const minRole = { minRole: roles.SUPER }
  const scope = { scope: roles.ADMIN }
  verifyRole(minRole)(scope)
    .catch(err => {
      t.ok(err, 'Unauthorized scope is rejected')
      t.equal(err.message, auth.UNAUTHORIZED, 'Unauthorized rejected with correct message')
      t.end()
    })
})

tape('test verifyRole with minRole SUPER, user scope SUPER', t => {
  const minRole = { minRole: roles.SUPER }
  const scope = { scope: roles.SUPER }
  const result = verifyRole(minRole)(scope)
  t.notOk(result, 'result of function should be undefined (just return, allow through)')
  t.end()
})

tape('test verifyRole with minRole ADMIN, user scope BASIC', t => {
  const minRole = { minRole: roles.ADMIN }
  const scope = { scope: roles.BASIC }
  verifyRole(minRole)(scope)
    .catch(err => {
      t.ok(err, 'Unauthorized scope is rejected')
      t.equal(err.message, auth.UNAUTHORIZED, 'Unauthorized rejected with correct message')
      t.end()
    })
})

tape('test verifyRole with minRole ADMIN, user scope ADMIN', t => {
  const minRole = { minRole: roles.ADMIN }
  const scope = { scope: roles.ADMIN }
  const result = verifyRole(minRole)(scope)
  t.notOk(result, 'result of function should be undefined (just return, allow through)')
  t.end()
})

tape('test verifyRole with minRole ADMIN, user scope SUPER', t => {
  const minRole = { minRole: roles.ADMIN }
  const scope = { scope: roles.SUPER }
  const result = verifyRole(minRole)(scope)
  t.notOk(result, 'result of function should be undefined (just return, allow through)')
  t.end()
})

tape('test verifyRole with minRole BASIC, user scope BASIC', t => {
  const minRole = { minRole: roles.BASIC }
  const scope = { scope: roles.ADMIN }
  const result = verifyRole(minRole)(scope)
  t.notOk(result, 'result of function should be undefined (just return, allow through)')
  t.end()
})

tape('test verifyRole with minRole BASIC, user scope BASIC', t => {
  const minRole = { minRole: roles.BASIC }
  const scope = { scope: roles.ADMIN }
  const result = verifyRole(minRole)(scope)
  t.notOk(result, 'result of function should be undefined (just return, allow through)')
  t.end()
})

tape('test verifyRole with minRole BASIC, user scope SUPER', t => {
  const minRole = { minRole: roles.BASIC }
  const scope = { scope: roles.SUPER }
  const result = verifyRole(minRole)(scope)
  t.notOk(result, 'result of function should be undefined (just return, allow through)')
  t.end()
})

tape('test addUserIdToSession with non existant user', t => {
  const req = {
    user: {
      username: 'notreal'
    }
  }
  addUserIdToSession(req)
    .catch(err => {
      t.ok(err, 'Non existant user is rejected')
      t.equal(err.message, auth.UNAUTHORIZED, 'Rejected with correct message')
      t.end()
    })
})

tape('test addUserIdToSession with existant user', t => {
  User.create(validUser1)
    .then(() => {
      const req = {
        user: {
          username: validUser1.username
        }
      }
      addUserIdToSession(req)
        .then(result => {
          t.ok(result, 'result does exist')
          t.ok(req.user.id, 'id has been attached to request object')
          t.end()
        })
        .catch(err => t.end(err))
    })
    .catch(err => t.end(err))
})
