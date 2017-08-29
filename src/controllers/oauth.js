const url = require('url')
const qs = require('querystring')

const OAuthServer = require('express-oauth-server')
const authModel = require('../authModel')
const { messages: errMessages } = require('../constants/errors')

const { rejectIfNull } = require('../db/utils')

// models
const User = require('../models/User')
const Client = require('../models/auth/Client')

// create new OAuthServer
const oauth = new OAuthServer({ model: authModel })

const oauthController = module.exports = {}

oauthController.getAuthorizePage = (req, res, next) => {
  if (!req.query || !req.query.client_id) {
    return res.boom.badRequest(errMessages.NOCLIENTID)
  }
  if (!req.query.redirect_uri) {
    return res.boom.badRequest(errMessages.NOREDIRECT)
  }
  if (!req.query.state) {
    return res.boom.badRequest(errMessages.NOSTATE)
  }

  if (!req.user) {
    const queries = {
      client_id: req.query.client_id,
      return_to: url.parse(req.url).path
    }
    return res.redirect('/login?' + qs.stringify(queries))
  }

  Client.findOne({ _id: req.query.client_id })
    .populate('user')
    .then(rejectIfNull('client_id is incorrect'))
    .then(client => {
      if (!client.user) {
        // should error?
        client.user = { username: '<user not found>' }
      }
      res.render('authorize', {
        name: client.name,
        user: client.user.username,
        redirect_uri: req.query.redirect_uri,
        client_id: req.query.client_id,
        state: req.query.state
      })
    })
    .catch(next)
}

oauthController.getAuthorizationCode = oauth.authorize({
  authenticateHandler: {
    // dummy function for now, just finds a user
    // DANGER: currently insecure
    handle: req => {
      return User.findOne({})
    }
  }
})

oauthController.getToken = oauth.token()
