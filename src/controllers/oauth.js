const OAuthServer = require('express-oauth-server')
const authModel = require('../authModel')
const { validateUserAndAddId } = require('../middleware/validateUser.js')

// models
const Client = require('../models/auth/Client')

// create new OAuthServer
const oauth = new OAuthServer({ model: authModel })

const oauthController = module.exports = {}

oauthController.getAuthorizePage = (req, res, next) => {
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
      // TODO: this should display correct authorization grant prompt page
      // res.sendFile(path.join(__dirname, 'public', 'authorize.html'))
      res.send('TODO')
    })
    .catch(next)
}

oauthController.getAuthorizationCode = oauth.authorize({
  authenticateHandler: {
    handle: validateUserAndAddId
  }
})

oauthController.getToken = oauth.token()
