const mongoose = require('mongoose')

const { productCategories } = require('./constants.json')
const { addStaticSchemaMethods, customRequireValidator } = require('../db/utils')

const productTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String
  },
  { _id: false }
)

const productSchema = mongoose.Schema(
  {
    // id of owner in user table
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // categories can be an array of one or more strings from the enum, is required here
    categories: { type: [{ type: String, enum: productCategories }], required: true },
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
