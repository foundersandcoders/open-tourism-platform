const mongoose = require('mongoose')

const { productCategories } = require('./constants.json')
const { addStaticSchemaMethods, customRequireValidator } = require('../db/utils')

const productTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String
  }
)

const productSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: [{ type: String, enum: productCategories }],
    imageUrl: String,
    cost: Number,
    en: productTranslatedFieldsSchema,
    ar: productTranslatedFieldsSchema
  },
  {
    timestamps: true
  }
)

// add custom validation
productSchema.pre('validate', customRequireValidator)
// add methods which throw errors when there's nothing matching the given id
addStaticSchemaMethods(productSchema)

module.exports = mongoose.model('Product', productSchema)
