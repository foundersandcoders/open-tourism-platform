const Place = require('../models/Place')

const placeController = module.exports = {}

placeController.getAll = (req, res, next) => {
  // sends back array of places, filtered by queries
  Place.find(req.query)
    .then(places => res.status(200).send(places))
    .catch(next)
}

placeController.getById = (req, res, next) => {
  // receives id in url
  // sends back one place or errors
  const id = req.params.id
  Place.findByIdOrError(id)
    .then(place => res.status(200).send(place))
    .catch(next)
}

placeController.create = (req, res, next) => {
  // receives json for place in body
  // sends back created place
  const newPlace = new Place(req.body)
  newPlace.save()
    .then(place => res.status(201).send(place))
    .catch(next)
}

placeController.update = (req, res, next) => {
  // receives id in url
  // receives updated json for place in body
  // updates or errors
  const id = req.params.id
  Place.findByIdAndUpdateOrError(id, req.body, { new: true })
    .then(updatedPlace => res.status(200).send(updatedPlace))
    .catch(next)
}

placeController.delete = (req, res, next) => {
  // receives id in url
  // deletes or errors
  const id = req.params.id
  Place.findByIdAndRemoveOrError(id)
    .then(() => res.status(204).send())
    .catch(next)
}
