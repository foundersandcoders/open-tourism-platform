const boom = require('boom')
const { oauthServer } = require('../controllers/oauth')
const { auth } = require('../constants/errors.json')
const { Request, Response } = require('oauth2-server')

module.exports = (req, res, next) => {
  return oauthServer.server.authenticate(new Request(req), new Response(res))
  .then(token => {
    // everything about the user is stored on the request
    req.user = token.user
    next()
  })
  .catch(err => next())
}
