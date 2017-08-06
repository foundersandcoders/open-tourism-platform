const path = require('path')
const OAuthServer = require('express-oauth-server')
const authModel = require('./authModel')

// models
const UserTests = require('./models/auth/UserTests')
const Token = require('./models/auth/Token')
const Client = require('./models/auth/Client')
const AuthorizationCode = require('./models/auth/AuthorizationCode')

// constants for creating test data
const CLIENT_ID = '507f1f77bcf86cd799439011'
const USER_ID = '5986abad5e2d852cb1ee6bce'

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

router.post('/authorize', oauth.authorize())

// TOKEN ROUTE: request for an access token, needs access code
router.post('/token', oauth.token())

// SECURE ROUTES
router.use('/secure', oauth.authenticate())

router.get('/secure/secrets', (req, res) => {
  res.send('SECRETS')
})

// create a new client (WIP)
router.post('/clients', (req, res) => {
  // get grants and redirect URIs from request
  // generate id (client id)
  // generate client secret
  Client.save()
})

// DEVELOPMENT/TESTING ROUTES

// empty the db
// UserTests.remove({})
//   .then(() => console.log('removed users.'))
//   .catch(err => console.log('error removing users.'))
// Client.remove({})
//   .then(() => console.log('removed clients.'))
//   .catch(err => console.log('error removing clients.'))
// Token.remove({})
//   .then(() => console.log('removed tokens.'))
//   .catch(err => console.log('error removing tokens.'))
// AuthorizationCode.remove({})
//   .then(() => console.log('removed codes.'))
//   .catch(err => console.log('error removing codes.'))

// create a user
router.get('/createUser', (req, res) => {
  UserTests.create({
    _id: USER_ID,
    id: USER_ID,
    username: 'username',
    password: 'password',
    email: 'test'
  })
  .then(user => res.send(user))
  .catch(err => res.send(err))
})

// create a client
router.get('/createClient', (req, res) => {
  const { client } = require('../tests/fixtures/auth/clients.json')
  Client.create(client)
  .then(client => res.send(client))
  .catch(err => res.send(err))
})

// create a code
router.get('/createCode', (req, res) => {
  const { authorizationCode } = require('../tests/fixtures/auth/authorizationCodes.json')
  AuthorizationCode.create(authorizationCode)
  .then(code => res.send(code))
  .catch(err => res.send(err))
})

// create a token
router.get('/createToken', (req, res) => {
  Token.create({
    user: USER_ID,
    accessToken: 'token'
  })
  .then(token => res.send(token))
  .catch(err => res.send(err))
})

// for dev purposes, to see db data
router.get('/clients', (req, res) => {
  Client.find()
    .then(clients => res.send(clients))
    .catch(err => res.send(err))
})
router.get('/tokens', (req, res) => {
  Token.find()
    .populate('user')
    .then(tokens => res.send(tokens))
    .catch(err => res.send(err))
})
router.get('/users', (req, res) => {
  UserTests.find()
    .then(users => res.send(users))
    .catch(err => res.send(err))
})
router.get('/codes', (req, res) => {
  AuthorizationCode.find()
    .then(codes => res.send(codes))
    .catch(err => res.send(err))
})

module.exports = router
