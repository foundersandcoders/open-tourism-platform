const mongoose = require('mongoose')

const { productCategories } = require('../constants.json')

const productSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    category: [{ type: String, enum: productCategories }],
    description: String,
    imageUrl: String,
    cost: Number
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Product', productSchema)
