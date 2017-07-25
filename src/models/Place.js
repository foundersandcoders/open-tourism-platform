const mongoose = require('mongoose')

const { placeCategories, accessibilityOptions } = require('./constants.json')
const { findByIdOrError, findByIdAndUpdateOrError, findByIdAndRemoveOrError } = require('../db/utils')

const placeSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    description: String,
    address: String,
    location: { type: [Number], index: '2dsphere' },
    category: [{ type: String, enum: placeCategories }],
    accessibilityOptions: [{ type: String, enum: accessibilityOptions }],
    openingHours: String,
    imageUrl: String,
    website: String,
    phone: String,
    email: String
  },
  {
    timestamps: true
  }
)

// methods which throw errors when there's nothing matching the given id
placeSchema.statics.findByIdOrError = findByIdOrError
placeSchema.statics.findByIdAndUpdateOrError = findByIdAndUpdateOrError
placeSchema.statics.findByIdAndRemoveOrError = findByIdAndRemoveOrError

module.exports = mongoose.model('Place', placeSchema)
