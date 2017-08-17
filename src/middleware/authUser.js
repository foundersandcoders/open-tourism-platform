const User = require('../models/User')
const roles = require('../constants/roles.js')
const { auth } = require('../constants/errors.json')
const boom = require('boom')

const verifyRole = ({ minRole }) => user => {
  const userScope = user.scope

  if (minRole === roles.BASIC) return
  if (minRole === roles.ADMIN && userScope !== roles.BASIC) return
  if (minRole === roles.SUPER && userScope === roles.SUPER) return

  return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
}

const addUserIdToSession = req => {
  return User.findOne({ username: req.user.username }).then(user => {
    if (!user) {
      return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
    }

    req.user.id = user.id
    return req.user
  })
}

module.exports = opts => (req, res, next) => {
  addUserIdToSession(req)
    .then(verifyRole(opts))
    .then(() => { next() })
    .catch(next)
}

// export functions for testing
module.exports.addUserIdToSession = addUserIdToSession
module.exports.verifyRole = verifyRole
