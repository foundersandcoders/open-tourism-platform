const mongoose = require('mongoose')

const { placeCategories, accessibilityOptions } = require('./constants.json')
const { addStaticSchemaMethods, customRequireValidator } = require('../db/utils')

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

// add custom validation
placeSchema.pre('validate', customRequireValidator)
// add methods which throw errors when there's nothing matching the given id
addStaticSchemaMethods(placeSchema)

module.exports = mongoose.model('Place', placeSchema)
