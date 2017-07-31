const mongoose = require('mongoose')

const { eventCategories, accessibilityOptions } = require('./constants.json')
const { addStaticSchemaMethods, customRequireValidator } = require('../db/utils')

const eventTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String
  },
  { _id: false }
)

const eventSchema = mongoose.Schema(
  {
    // id of owner in user table
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // categories can be an array of one or more strings from the enum, is required here
    categories: { type: [{ type: String, enum: eventCategories }], required: true },
    // id of place in place table
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    // accessibilityOptions can be an array of one or more strings from the enum
    accessibilityOptions: { type: [{ type: String, enum: accessibilityOptions }] },
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
