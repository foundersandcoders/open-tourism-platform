const boom = require('boom')
const { oauthServer } = require('../controllers/oauth')
const { auth } = require('../constants/errors.json')
const { Request, Response } = require('oauth2-server')

module.exports = opts => (req, res, next) => {
  const defaultOptions = {
    credentialsRequired: false
  }
  const options = Object.assign(defaultOptions, opts)
  
  if (!req.headers.authorization) {
    return options.credentialsRequired
      ? next(boom.unauthorized(auth.UNAUTHORIZED))
      : next()
  }

  oauthServer.server.authenticate(new Request(req), new Response(res))
  .then(token => {
    // everything about the user is stored on the request
    req.user = token.user
    next()
  })
  .catch(err => {
    return options.credentialsRequired
    ? next(err)
    : next()
  }) 

}