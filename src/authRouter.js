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
router.get('/authorize', (req, res) => {
  // get query params to find out what the app is
  // display correct authorization grant prompt
  res.sendFile(path.join(__dirname, 'public', 'authorize.html'))
})

router.post('/authorize', oauth.authorize())

// TOKEN ROUTE: request for an access token, needs access code
router.post('/oauth/token', oauth.token())

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

// // empty the db
// UserTests.remove({})
//   .then(() => console.log('removed users.'))
//   .catch(err => console.log('error removing users.'))
// Client.remove({})
//   .then(() => console.log('removed clients.'))
//   .catch(err => console.log('error removing clients.'))
// Token.remove({})
//   .then(() => console.log('removed tokens.'))
//   .catch(err => console.log('error removing tokens.'))

// create a user
router.get('/oauth/createUser', (req, res) => {
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
router.get('/oauth/createClient', (req, res) => {
  Client.create({
    user: USER_ID,
    id: CLIENT_ID,
    secret: 'secret',
    grants: [ 'authorization_code' ],
    redirectUris: [ 'localhost:3000' ]
  })
  .then(client => res.send(client))
  .catch(err => res.send(err))
})

// create a token
router.get('/oauth/createToken', (req, res) => {
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
