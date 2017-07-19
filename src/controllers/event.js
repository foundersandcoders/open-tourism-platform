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
  // sends back one event
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
  // receives json for event in body
  // adds to db
  // status codes: 201 (created), 500 (server error)
  const newEvent = new Event(req.body)
  newEvent.save()
    .then(event => {
      res.status(201).send(event)
    })
    .catch(err => {
      // Sending back 500 error, may need changing when we think about how we validate
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

eventController.update = (req, res) => {

}

eventController.delete = (req, res) => {
  // receives id in url
  // deletes
  // status codes: 204 (success), 400 (bad request)
  Event.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).send()
    })
    .catch(err => {
      const errorObj = { message: `Bad Request: ${err.message}` }
      res.status(400).send(errorObj)
    })
}
