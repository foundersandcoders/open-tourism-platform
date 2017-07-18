const User = require('../models/User')

const usersHandlers = module.exports = {}

usersHandlers.get = (req, res) => {
  // sends back array of users, filtered by queries
  // status codes: 200 (success)
  User.find()
    .then(users => {
      res.send(users)
    })
    .catch(err => {
      res.status(500).send(`Database Error: ${err}`)
    })
}

usersHandlers.getById = (req, res) => {
  // receives id in url
  // sends back one user
  // status codes: 200 (success), 404 (not found)
  const id = req.params.id
  User.findById(id, (err, user) => {
    // err could be for invalid id or user not found
    if (err) {
      const errorObj = { message: `Cannot find user with id=${id}` }
      return res.status(404).send(errorObj)
    }
    res.send(user)
  })
}

usersHandlers.post = (req, res) => {
  // receives json for user in body
  // adds to db
  // status codes: 201 (created), 400 (bad request)
  res.send()
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
