const mongoose = require('mongoose')

const { placeCategories, accessibilityOptions } = require('./constants.json')
const { customRequireValidator } = require('../db/utils')

const placeTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    address: String,
    openingHours: String
  },
  { _id: false }
)

const placeSchema = mongoose.Schema(
  {
    // id of owner in user table
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: [Number], index: '2dsphere' },
    // categories can be an array of one or more strings from the enum, is not required here
    categories: { type: [{ type: String, enum: placeCategories }] },
    // accessibilityOptions can be an array of one or more strings from the enum
    accessibilityOptions: { type: [{ type: String, enum: accessibilityOptions }] },
    imageUrl: String,
    website: String,
    phone: String,
    email: String,
    en: placeTranslatedFieldsSchema,
    ar: placeTranslatedFieldsSchema
  },
  {
    timestamps: true
  }
)

// add custom validation
placeSchema.pre('validate', customRequireValidator)

module.exports = mongoose.model('Place', placeSchema)
