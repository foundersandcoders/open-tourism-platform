const mongoose = require('mongoose')

const { eventCategories, accessibilityOptions } = require('./constants.json')
const { addStaticSchemaMethods } = require('../db/utils')

const eventSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    category: [{ type: String, enum: eventCategories, required: true }],
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    accessibilityOptions: [{ type: String, enum: accessibilityOptions, required: false }],
    startTime: Date,
    endTime: Date,
    description: String,
    cost: String,
    imageUrl: String
  },
  {
    timestamps: true
  }
)

// add methods which throw errors when there's nothing matching the given id
addStaticSchemaMethods(eventSchema)

module.exports = mongoose.model('Event', eventSchema)
