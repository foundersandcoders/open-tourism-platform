const User = require('../models/User')
const { auth } = require('../constants/errors.json')
const boom = require('boom')

const authenticateUserAndAddId = (req) => {
  return User.findOne({ username: req.user.username })
    .then(user => {
      if (!user) {
        return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
      }

      req.user.id = user.id
      // user is returned for use in oauth
      return req.user
    })
}

module.exports = (req, res, next) => {
  authenticateUserAndAddId(req)
    .then(() => next())
    .catch(next)
}

module.exports.authenticateUserAndAddId = authenticateUserAndAddId
