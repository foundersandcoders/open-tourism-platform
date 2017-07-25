const mongoose = require('mongoose')

const { placeCategories, accessibilityOptions } = require('./constants.json')
const { customRequireValidator } = require('../db/utils')

const placeTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    address: String,
    openingHours: String
  }
)

const placeSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: [Number], index: '2dsphere' },
    category: [{ type: String, enum: placeCategories }],
    accessibilityOptions: [{ type: String, enum: accessibilityOptions }],
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

placeSchema.pre('validate', customRequireValidator)

module.exports = mongoose.model('Place', placeSchema)
