const Client = require('../models/auth/Client')
const grants = require('../constants/grants')

const randtoken = require('rand-token')

const oauthClientController = module.exports = {}

oauthClientController.getAll = (req, res, next) => {
  // sends back array of users, filtered by queries
  Client.find()
    .then(clients => res.status(200).send(clients))
    .catch(next)
}

oauthClientController.create = (req, res, next) => {
  // receives json for user in body
  // sends back created user
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
