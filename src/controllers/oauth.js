const url = require('url')
const qs = require('querystring')

const OAuthServer = require('express-oauth-server')
const authModel = require('../authModel')

const { rejectIfNull } = require('../db/utils')

// models
const User = require('../models/User')
const Client = require('../models/auth/Client')

// create new OAuthServer
const oauth = new OAuthServer({ model: authModel })

const oauthController = module.exports = {}

oauthController.getAuthorizePage = (req, res, next) => {
  // TODO: change these to next(boomError)?
  if (!req.query || !req.query.client_id) {
    return res.boom.badRequest('no client_id provided')
  }
  if (!req.query.redirect_uri) {
    return res.boom.badRequest('no redirect_uri provided')
  }
  if (!req.query.state) {
    return res.boom.badRequest('no state provided')
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
        client.user = { username: '<user not found>'}
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
