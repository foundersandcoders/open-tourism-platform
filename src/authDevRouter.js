const router = require('express').Router()

// DEVELOPMENT/TESTING ROUTES

// empty the db
router.get('/deleteAll', (req, res) => {
  Promise.resolve()
  .then(() => User.remove({}))
  .then(() => Client.remove({}))
  .then(() => Token.remove({}))
  .then(() => AuthorizationCode.remove({}))
  .then(() => res.send('successfully removed users, clients, tokens, codes.'))
  .catch(err => res.send(err))
})

// create a user
router.get('/createUser', (req, res) => {
  const { user } = require('../tests/fixtures/users.json')
  User.create(user)
  .then(newUser => res.send(newUser))
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
// router.get('/createToken', (req, res) => {
//   Token.create({
//     user: '5986abad5e2d852cb1ee6bce',
//     accessToken: 'token'
//   })
//   .then(token => res.send(token))
//   .catch(err => res.send(err))
// })

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
  User.find()
    .then(users => res.send(users))
    .catch(err => res.send(err))
})
router.get('/codes', (req, res) => {
  AuthorizationCode.find()
    .then(codes => res.send(codes))
    .catch(err => res.send(err))
})

module.exports = router
