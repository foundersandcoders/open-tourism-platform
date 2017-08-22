const User = require('../models/User')
const { auth } = require('../constants/errors.json')
const boom = require('boom')

module.exports = (req, res, next) => {
  User.findOne({ username: req.user.username })
    .then(user => {
      if (!user) {
        next(boom.unauthorized(auth.UNAUTHORIZED))
      }

      req.user.id = user.id
      next()
    })
    .catch(next)
}
