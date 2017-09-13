const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server')
// const validateHeaderToken = require('../../src/middleware/validateHeaderToken')
const fieldPermissions = require('../../src/middleware/fieldPermissions.js')
const roles = require('../../src/constants/roles.js')

const User = require('../../src/models/User')
const Event = require('../../src/models/Event')

const { user } = require('../fixtures/users.json')
const { event } = require('../fixtures/events.json')
const wrongUser = { id: 'wrong' }

// prepare the db
tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Event.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('filling db.', t => {
  Promise.all([
    User.create(user),
    Event.create(event)
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})


