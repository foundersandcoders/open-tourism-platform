const path = require('path')
const OAuthServer = require('express-oauth-server')
const authModel = require('./authModel')

// models
const User = require('./models/User')
const Client = require('./models/auth/Client')

// create new OAuthServer
const oauth = new OAuthServer({ model: authModel })
const router = require('express').Router()

// AUTHORIZE ROUTES

// should display the authorization grant page for a specific app/client
router.get('/authorize', (req, res, next) => {
  // get query params to find out what the app is (client_id is required)
  if (!req.query || !req.query.client_id) {
    return res.boom.badRequest('no client_id provided')
  }
  Client.findOne({ id: req.query.client_id })
    .populate('user')
    .then(client => {
      if (client === null) {
        return res.boom.badRequest('client_id is incorrect')
      }
      console.log(`app created by ${client.user.username} requests your authorisation.`)
      // TODO: this should display correct authorization grant prompt page
      res.sendFile(path.join(__dirname, 'public', 'authorize.html'))
    })
    .catch(next)
})

// should redirect supplying an authorization code
router.post('/authorize', oauth.authorize({
  authenticateHandler: {
    // dummy function for now, just finds a user
    handle: req => {
      console.log('running custom authenticate handler.')
      return User.findOne({})
    }
  }
}))

// TOKEN ROUTE: request for an access token
router.post('/token', oauth.token())

// SECURE ROUTES
router.use('/secure', oauth.authenticate())

// create a new client (WIP)
router.post('/clients', (req, res) => {
  // get grants and redirect URIs from request
  // generate id (client id)
  // generate client secret
  Client.save()
})

module.exports = router
