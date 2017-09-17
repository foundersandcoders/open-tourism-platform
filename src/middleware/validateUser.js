const User = require('../models/User')
const { auth } = require('../constants/errors.json')
const boom = require('boom')

const validateUserAndAddId = (req) => {
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

module.exports = opts => (req, res, next) => {
  const fixedOptions = {
    credentialsRequired: false
  }
  const { credentialsRequired } = Object.assign(fixedOptions, opts)
  if (!req.user) {
    return credentialsRequired
      ? next(boom.unauthorized(auth.UNAUTHORIZED))
      : next()
  }
  validateUserAndAddId(req)
    .then(() => next())
    .catch(next)
}

module.exports.validateUserAndAddId = validateUserAndAddId
