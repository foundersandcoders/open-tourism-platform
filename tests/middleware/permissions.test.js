const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server')
const permissions = require('../../src/middleware/permissions.js')
const roles = require('../../src/constants/roles.js')

const User = require('../../src/models/User')
const Product = require('../../src/models/Product')
const Event = require('../../src/models/Event')
const Place = require('../../src/models/Place')

const { user } = require('../fixtures/users.json')

const checkUserOwnsResource = permissions.checkUserOwnsResource

// prepare the db
tape('emptying db.', t => {
  Promise.all([
    User.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('filling db.', t => {
  Promise.all([
    User.create(user)
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

// the tests
tape('checkUserOwnsResource with resource \'User\', and the correct user', t => {
  checkUserOwnsResource(User)(user._id)(user)
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('checkUserOwnsResource with resource \'User\', and an incorrect user', t => {
  const wrongUser = { id: 'wrong' }
  checkUserOwnsResource(User)(user._id)(wrongUser)
  .then(() => t.end('promise should reject, as user is wrong'))
  .catch(err => t.end())
})

