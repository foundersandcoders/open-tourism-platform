const mongoose = require('mongoose')

const { placeCategories, accessibilityOptions } = require('../constants.json')

const placeSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    description: String,
    address: String,
    lat: Number,
    lng: Number,
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

module.exports = mongoose.model('Place', placeSchema)
