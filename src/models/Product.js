const mongoose = require('mongoose')

const { productCategories } = require('./constants.json')
const { addStaticSchemaMethods } = require('../db/utils')

const productSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    category: [{ type: String, enum: productCategories }],
    description: String,
    imageUrl: String,
    cost: Number
  },
  {
    timestamps: true
  }
)

// add methods which throw errors when there's nothing matching the given id
addStaticSchemaMethods(productSchema)

module.exports = mongoose.model('Product', productSchema)
