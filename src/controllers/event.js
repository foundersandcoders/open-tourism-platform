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

}

eventController.create = (req, res) => {

}

eventController.update = (req, res) => {

}

eventController.delete = (req, res) => {

}
