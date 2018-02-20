const mongoose = require('mongoose')

const { eventCategories, accessibilityOptions } = require('./constants.json')
const { customRequireValidator } = require('../db/utils')

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
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // categories can be an array of one or more strings from the enum, is required here
    categories: { type: [{ type: String, enum: eventCategories }], required: true },
    // id of place in place table
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    // accessibilityOptions can be an array of one or more strings from the enum
    accessibilityOptions: { type: [{ type: String, enum: accessibilityOptions }] },
    startTime: Date,
    endTime: Date,
    cost: String,
    imageUrl: String,
    en: eventTranslatedFieldsSchema,
    ar: eventTranslatedFieldsSchema,
    verified: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

// add custom validation
eventSchema.pre('validate', customRequireValidator)

module.exports = mongoose.model('Event', eventSchema)
