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
  // sends back one user or errors
  const id = req.params.id
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
  // receives updated json for user in body
  // updates or errors
  const id = req.params.id
  User.findByIdAndUpdateOrError(id, req.body, { new: true })
    .then(updatedUser => res.status(200).send(updatedUser))
    .catch(next)
}

userController.delete = (req, res, next) => {
  // receives id in url
  // deletes or errors
  const id = req.params.id
  User.findByIdAndRemoveOrError(id)
    .then(() => res.status(204).send())
    .catch(next)
}
