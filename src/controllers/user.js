const User = require('../models/User')

const userController = module.exports = {}

userController.getAll = (req, res) => {
  // sends back array of users, filtered by queries
  // status codes: 200 (success)
  User.find(req.query)
    .then(users => {
      res.send(users)
    })
    .catch((err) => {
      const errorObj = { message: `Database Error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

userController.getById = (req, res) => {
  // receives id in url
  // sends back one user
  // status codes: 200 (success), 404 (not found)
}

userController.create = (req, res) => {
  // receives json for user in body
  // adds to db
  // status codes: 201 (created), 400 (bad request)
}

userController.update = (req, res) => {
  // receives id in url
  // receives updated json for user in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
}

userController.delete = (req, res) => {
  // receives id in url
  // deletes
  // status codes: 200 (success), 400 (bad request)
}