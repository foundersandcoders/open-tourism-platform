const mongoose = require('mongoose')

// placeholders for now
const categories = ['restaurant, cafe']
const accesibilityOptions = ['braille menu']

const placeSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    address: String,
    lat: Number,
    lng: Number,
    category: { type: [String], enum: categories },
    accessibilityOptions: [{ type: String, enum: accesibilityOptions }],
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
