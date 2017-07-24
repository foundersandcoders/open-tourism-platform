const User = require('../models/User')

const userController = module.exports = {}

userController.getAll = (req, res, next) => {
  // sends back array of users, filtered by queries
  User.find(req.query)
    .then(users => res.send(users))
    .catch(next)
}

userController.getById = (req, res, next) => {
  // receives id in url
  // sends back one user or errors
  const id = req.params.id
  User.findByIdOrError(id)
    .then(user => res.send(user))
    .catch(next)
}

userController.create = (req, res, next) => {
  // receives json for user in body
  // status codes: 201 (created), 500 (server error)
  const newUser = new User(req.body)
  newUser.save()
    .then(user => res.status(201).send(user))
    .catch(next)
}

userController.update = (req, res, next) => {
  // receives id in url
  // receives updated json for user in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
  const id = req.params.id
  User.findByIdAndUpdateOrError(id, req.body, { new: true })
    .then(updatedUser => res.send(updatedUser))
    .catch(next)
}

userController.delete = (req, res, next) => {
  // receives id in url
  // deletes
  // status codes: 204 (success), 400 (bad request)
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
}
