const User = require('../models/User')

const userControllers = module.exports = {}

userControllers.getAll = (req, res) => {
  // sends back array of users, filtered by queries
  // status codes: 200 (success)
  User.find()
    .then(users => {
      res.send(users)
    })
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
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

userControllers.update = (req, res) => {
  // receives id in url
  // receives updated json for user in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
}

userControllers.delete = (req, res) => {
  // receives id in url
  // deletes
  // status codes: 200 (success), 400 (bad request)
}
