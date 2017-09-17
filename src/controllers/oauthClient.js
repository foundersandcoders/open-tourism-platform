const Client = require('../models/auth/Client')
const grants = require('../constants/grants')

const randtoken = require('rand-token')

const oauthClientController = module.exports = {}

oauthClientController.getAll = (req, res, next) => {
  // sends back array of clients owned by the logged in user
  Client.find({ user: req.user.id })
    .then(clients => res.status(200).send(clients))
    .catch(next)
}

oauthClientController.create = (req, res, next) => {
  // receives json for client in body
  // sends back created client with secret and id
  const secret = randtoken.generate(16)
  const newClient = new Client({
    name: req.body.name,
    user: req.user.id,
    secret,
    grants: [grants.authCode],
    redirectUris: req.body.redirectUris
  })
  newClient.save()
    .then(client => res.status(201).send(client))
    .catch(next)
}
