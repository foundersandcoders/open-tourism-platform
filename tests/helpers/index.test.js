const { validUser1 } = require('../fixtures/users.json')
const helpers = require('../helpers/index.js')
const tape = require('tape')
const User = require('../../src/models/User.js')

tape('test helper to add user with hashed pw to db', t => {
  helpers.addUserWithHashedPassword(validUser1)
  .then(() => {
    User.findOne({})
    .then(user => {
      t.ok(user, 'User is added to db')
      t.equal(user.username, validUser1.username, 'Correct user is added')
      t.notEqual(user.password, validUser1.password, 'Password is hashed')
      helpers.dropCollectionAndEnd(User, t)
    })
    .catch(err => t.end(err))
  })
  .catch(err => t.end(err))
})
