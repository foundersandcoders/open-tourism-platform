const Place = require('../models/Place')

const placeController = module.exports = {}

placeController.getAll = (req, res) => {
  // sends back array of places, filtered by queries
  // status codes: 200 (success)
  Place.find(req.query)
    .then(places => {
      res.send(places)
    })
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

placeController.getById = (req, res) => {
  // receives id in url
  // sends back one place
  // status codes: 200 (success), 404 (not found)
  const id = req.params.id
  Place.findById(id)
    .then(place => res.send(place))
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(404).send(errorObj)
    })
}

placeController.create = (req, res) => {

}

placeController.update = (req, res) => {

}

placeController.delete = (req, res) => {

}
