const mongoose = require('mongoose')

const { placeCategories, accessibilityOptions } = require('./constants.json')
const { addStaticSchemaMethods } = require('../db/utils')

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

// add methods which throw errors when there's nothing matching the given id
addStaticSchemaMethods(placeSchema)

module.exports = mongoose.model('Place', placeSchema)
