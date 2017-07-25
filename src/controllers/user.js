const User = require('../models/User')

const userController = module.exports = {}

userController.getAll = (req, res, next) => {
  // sends back array of users, filtered by queries
  User.find(req.query)
    .then(users => res.status(200).send(users))
    .catch(next)
}

userController.getById = (req, res, next) => {
  // receives id in url
  const id = req.params.id
  // sends back one user or errors
  User.findByIdOrError(id)
    .then(user => res.status(200).send(user))
    .catch(next)
}

userController.create = (req, res, next) => {
  // receives json for user in body
  // sends back created user
  const newUser = new User(req.body)
  newUser.save()
    .then(user => res.status(201).send(user))
    .catch(next)
}

userController.update = (req, res, next) => {
  // receives id in url
  const id = req.params.id
  // receives updated json for user in body
  // updates or errors
  User.findByIdAndUpdateOrError(id, req.body, { new: true })
    .then(updatedUser => res.status(200).send(updatedUser))
    .catch(next)
}

userController.delete = (req, res, next) => {
  // receives id in url
  const id = req.params.id
  // deletes or errors
  User.findByIdAndRemoveOrError(id)
    .then(() => res.status(204).send())
    .catch(next)
}
