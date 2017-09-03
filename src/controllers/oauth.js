const url = require('url')
const qs = require('querystring')

const OAuthServer = require('express-oauth-server')
const authModel = require('../authModel')

const { messages: errMessages } = require('../constants/errors')
const { rejectIfNull } = require('../db/utils')
const { validateUserAndAddId } = require('../middleware/validateUser.js')

// models
const Client = require('../models/auth/Client')

// create new OAuthServer
const oauth = new OAuthServer({ model: authModel })

const oauthController = module.exports = {}

oauthController.getAuthorizePage = (req, res, next) => {
  if (!req.query || !req.query.client_id) {
    return res.boom.badRequest(errMessages.NO_CLIENT_ID)
  }
  if (!req.query.redirect_uri) {
    return res.boom.badRequest(errMessages.NO_REDIRECT_URI)
  }
  if (!req.query.state) {
    return res.boom.badRequest(errMessages.NO_STATE)
  }

  if (!req.user) {
    const queries = {
      client_id: req.query.client_id,
      return_to: url.parse(req.url).path
    }
    return res.redirect('/login?' + qs.stringify(queries))
  }

  Client.findById(req.query.client_id)
    .populate('user')
    .then(rejectIfNull(errMessages.INCORRECT_CLIENT_ID))
    .then(client => {
      res.render('authorize', {
        name: client.name,
        user: client.user && client.user.username,
        redirect_uri: req.query.redirect_uri,
        client_id: req.query.client_id,
        state: req.query.state
      })
    })
    .catch(next)
}

oauthController.getAuthorizationCode = oauth.authorize({
  authenticateHandler: {
    handle: validateUserAndAddId
  }
})

oauthController.getToken = oauth.token()
