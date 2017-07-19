const User = require('../models/User')

const userController = module.exports = {}

userController.getAll = (req, res) => {
  // sends back array of users, filtered by queries
  // status codes: 200 (success)
  User.find(req.query)
    .then(users => {
      res.send(users)
    })
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

userController.getById = (req, res) => {
  // receives id in url
  // sends back one user
  // status codes: 200 (success), 404 (not found)
  const id = req.params.id
  User.findById(id)
    .then(user => res.send(user))
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(404).send(errorObj)
    })
}

userController.create = (req, res) => {
  // receives json for user in body
  // adds to db
  // status codes: 201 (created), 500 (server error)
  const newUser = new User(req.body)
  newUser.save()
    .then(user => {
      res.status(201).send(user)
    })
    .catch(err => {
      // Sending back 500 error, may need changing when we think about how we validate
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

userController.update = (req, res) => {
  // receives id in url
  // receives updated json for user in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
  const id = req.params.id
  User.findByIdAndUpdate(id, req.body, { new: true })
    .then(updatedUser => res.send(updatedUser))
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(400).send(errorObj)
    })
}

userController.delete = (req, res) => {
  // receives id in url
  // deletes
  // status codes: 204 (success), 400 (bad request)
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).send()
    })
    .catch(err => {
      const errorObj = { message: `Bad Request: ${err.message}` }
      res.status(400).send(errorObj)
    })
}
