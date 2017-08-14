const User = require('../models/User')
const { rejectIfNull } = require('../db/utils')
const { messages: errMessages } = require('../constants/errors')

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
  User.findById(id)
    .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
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
  User.findByIdAndUpdate(id, req.body, { new: true })
    .then(rejectIfNull(errMessages.UPDATE_ID_NOT_FOUND))
    .then(updatedUser => res.status(200).send(updatedUser))
    .catch(next)
}

userController.delete = (req, res, next) => {
  // receives id in url
  // deletes or errors
  const id = req.params.id
  User.findByIdAndRemove(id)
    .then(rejectIfNull(errMessages.DELETE_ID_NOT_FOUND))
    .then(() => res.status(204).send())
    .catch(next)
}
