const tape = require('tape')

const fieldPermissions = require('../../src/middleware/fieldPermissions')
const { getUnauthorizedFields } = require('../../src/helpers/permissions')

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
