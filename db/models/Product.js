const mongoose = require('mongoose')

const categories = ['handicraft']

const productSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    category: { type: [String], enum: categories },
    description: String,
    imageUrl: String,
    cost: Number
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Product', productSchema)
