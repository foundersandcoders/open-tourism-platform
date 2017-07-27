const mongoose = require('mongoose')

const { eventCategories, accessibilityOptions } = require('./constants.json')
const { addStaticSchemaMethods, customRequireValidator } = require('../db/utils')

const eventTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String
  }
)

const eventSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: [{ type: String, enum: eventCategories }], required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    accessibilityOptions: [{ type: String, enum: accessibilityOptions, required: false }],
    startTime: Date,
    endTime: Date,
    cost: String,
    imageUrl: String,
    en: eventTranslatedFieldsSchema,
    ar: eventTranslatedFieldsSchema
  },
  {
    timestamps: true
  }
)

// add custom validation
eventSchema.pre('validate', customRequireValidator)
// add methods which throw errors when there's nothing matching the given id
addStaticSchemaMethods(eventSchema)

module.exports = mongoose.model('Event', eventSchema)
