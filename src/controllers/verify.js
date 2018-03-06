const Event = require('../models/Event')
const Place = require('../models/Place')
const { rejectIfNull } = require('../db/utils')
const { messages: errMessages } = require('../constants/errors')

const verifyController = module.exports = {}

verifyController.place = (req, res, next) => {
  const id = req.params.id
  Place.findByIdAndUpdate(id, { verified: true }, { new: true })
    .then(rejectIfNull(errMessages.UPDATE_ID_NOT_FOUND))
    .then(updatedPlace => res.status(200).send(updatedPlace))
    .catch(next)
}

verifyController.event = (req, res, next) => {
  const id = req.params.id
  Event.findByIdAndUpdate(id, { verified: true }, { new: true })
    .then(rejectIfNull(errMessages.UPDATE_ID_NOT_FOUND))
    .then(updatedEvent => res.status(200).send(updatedEvent))
    .catch(next)
}
