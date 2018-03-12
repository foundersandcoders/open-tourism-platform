const Place = require('../models/Place')
const { rejectIfNull } = require('../db/utils')
const { messages: errMessages } = require('../constants/errors')
const roles = require('../constants/roles')

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
  Place.findById(id)
    .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
    .then(place => res.status(200).send(place))
    .catch(next)
}

placeController.create = (req, res, next) => {
  // receives json for place in body
  // sends back created place
  let newPlaceDetails = req.body

  if (req.user.role !== roles.BASIC) {
    newPlaceDetails = Object.assign({}, req.body, { verified: true })
  } else {
    newPlaceDetails = Object.assign({}, req.body, { verified: false })
  }

  const newPlace = new Place(newPlaceDetails)
  newPlace.save()
    .then(place => res.status(201).send(place))
    .catch(next)
}

placeController.update = (req, res, next) => {
  // receives id in url
  // receives updated json for place in body
  // updates or errors
  const id = req.params.id
  Place.findByIdAndUpdate(id, req.body, { new: true })
    .then(rejectIfNull(errMessages.UPDATE_ID_NOT_FOUND))
    .then(updatedPlace => res.status(200).send(updatedPlace))
    .catch(next)
}

placeController.delete = (req, res, next) => {
  // receives id in url
  // deletes or errors
  const id = req.params.id
  Place.findByIdAndRemove(id)
    .then(rejectIfNull(errMessages.DELETE_ID_NOT_FOUND))
    .then(() => res.status(204).send())
    .catch(next)
}
