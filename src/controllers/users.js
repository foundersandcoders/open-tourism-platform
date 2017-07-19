const User = require('../models/User')

const userControllers = module.exports = {}

userControllers.getAll = (req, res) => {
  // sends back array of users, filtered by queries
  // status codes: 200 (success), 500 (database error)
  User.find()
    .then(users => {
      res.send(users)
    })
    .catch((err) => {
      const errorObj = { message: `Database Error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

userControllers.getById = (req, res) => {
  // receives id in url
  // sends back one user
  // status codes: 200 (success), 404 (not found)
}

userControllers.create = (req, res) => {
  // receives json for user in body
  // adds to db
  // status codes: 201 (created), 400 (bad request)
}

userControllers.update = (req, res) => {
  // receives id in url
  // receives updated json for user in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
}

userControllers.delete = (req, res) => {
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
