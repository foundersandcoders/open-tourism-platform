const mongoose = require('mongoose')

const { productCategories } = require('./constants.json')
const { findByIdOrError, findByIdAndUpdateOrError, findByIdAndRemoveOrError } = require('../db/utils')

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

// methods which throw errors when there's nothing matching the given id
productSchema.statics.findByIdOrError = findByIdOrError
productSchema.statics.findByIdAndUpdateOrError = findByIdAndUpdateOrError
productSchema.statics.findByIdAndRemoveOrError = findByIdAndRemoveOrError

module.exports = mongoose.model('Product', productSchema)
