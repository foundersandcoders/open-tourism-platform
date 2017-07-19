const Event = require('../models/Event')

const eventController = module.exports = {}

eventController.getAll = (req, res) => {
  // sends back array of events, filtered by queries
  // status codes: 200 (success)
  Event.find(req.query)
    .then(events => {
      res.send(events)
    })
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

eventController.getById = (req, res) => {
  // receives id in url
  // sends back one user
  // status codes: 200 (success), 404 (not found)
  const id = req.params.id
  Event.findById(id)
    .then(event => res.send(event))
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(404).send(errorObj)
    })
}

eventController.create = (req, res) => {

}

eventController.update = (req, res) => {

}

eventController.delete = (req, res) => {

}
