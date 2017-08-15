const mongoose = require('mongoose')

const { roles } = require('./constants.json')
const { customRequireValidator } = require('../db/utils')

const userTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    organisationName: String,
    organisationDescription: String
  },
  { _id: false }
)

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    isPublic: { type: Boolean, required: true, default: true },
    imageUrl: String,
    en: userTranslatedFieldsSchema,
    ar: userTranslatedFieldsSchema
  },
  {
    timestamps: true
  }
)

// add custom validation
userSchema.pre('validate', customRequireValidator)

module.exports = mongoose.model('User', userSchema)
