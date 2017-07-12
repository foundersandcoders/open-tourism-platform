const mongoose = require('mongoose')

const categories = ['music', 'dining']
const accessibilityOptions = ['braille-menu', 'wheelchair-friendly']

const eventSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: { type: String, required: true },
    category: { type: [String], enum: categories, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
    accessibilityOptions: { type: [String], enum: accessibilityOptions, required: false },
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

module.exports = mongoose.model('Event', eventSchema)
