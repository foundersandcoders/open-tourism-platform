const boom = require('boom')
const { oauthServer: oauth } = require('../controllers/oauth')
const { auth } = require('../constants/errors.json')

module.exports = opts => (req, res, next) => {
  const defaultOptions = {
    credentialsRequired: false
  }
  const options = Object.assign(defaultOptions, opts)
  
  if (!req.headers.Authentication) {
    return options.credentialsRequired
      ? next(boom.unauthorized(auth.UNAUTHORIZED))
      : next()
  }

  oauth.authenticate()
  .then(token => {
    req.user = token.user
    next()
  })
  .catch(err => options.credentialsRequired
    ? next(err)
    : next()
  )
}