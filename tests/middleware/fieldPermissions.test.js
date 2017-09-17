const tape = require('tape')

const { getUnauthorizedFields } = require('../../src/middleware/fieldPermissions.js')
const roles = require('../../src/constants/roles.js')

// the tests
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
    'f1': { minRole: roles.SUPER },
    'f2': { minRole: roles.ADMIN },
    'f3': { minRole: roles.BASIC },
    'f4': { minRole: roles.SUPER, ownerIsPermitted: true },
    'f5': { minRole: roles.ADMIN, ownerIsPermitted: true },
    'f6': { minRole: roles.BASIC, ownerIsPermitted: true }
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
