const User = require('../models/User')

const usersHandlers = module.exports = {}

usersHandlers.get = (req, res) => {
  // sends back array of users, filtered by queries
  // status codes: 200 (success)
  User.find()
    .then(users => {
      res.send(users)
    })
    .catch(() => {
      const errorObj = { message: 'Database error' }
      res.status(500).send(errorObj)
    })
}

usersHandlers.getById = (req, res) => {
  // receives id in url
  // sends back one user
  // status codes: 200 (success), 404 (not found)
}

usersHandlers.post = (req, res) => {
  // receives json for user in body
  // adds to db
  // status codes: 201 (created), 400 (bad request)
}

usersHandlers.update = (req, res) => {
  // receives id in url
  // receives updated json for user in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
}

usersHandlers.delete = (req, res) => {
  // receives id in url
  // deletes
  // status codes: 200 (success), 400 (bad request)
}
