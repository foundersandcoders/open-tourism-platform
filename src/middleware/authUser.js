const boom = require('boom')

const roles = require('../constants/roles.js')
const { auth } = require('../constants/errors.json')

const User = require('../models/User')

// function to check role of user matches minRole allowed on the route
const verifyRole = ({ minRole }) => user => {
  const userScope = user.scope

  if (minRole === roles.BASIC) return
  if (minRole === roles.ADMIN && userScope !== roles.BASIC) return
  if (minRole === roles.SUPER && userScope === roles.SUPER) return

  return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
}

// Check user from the token exists, and add their id to the req.user for potential use in permissioning
const addUserIdToSession = req => {
  return User.find({ username: req.user.username }).then(users => {
    if (users.length === 0) {
      return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
    }

    req.user.id = users[0].id
    return req.user
  })
}

module.exports = opts => (req, res, next) => {
  addUserIdToSession(req)
    .then(verifyRole(opts))
    .then(() => { next() })
    .catch(next)
}
