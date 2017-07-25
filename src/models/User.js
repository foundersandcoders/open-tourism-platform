const mongoose = require('mongoose')

const { roles } = require('./constants.json')
const { addStaticSchemaMethods, customRequireValidator } = require('../db/utils')

const userTranslatedFieldsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    organisationName: String,
    organisationDescription: String
  }
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

userSchema.pre('validate', customRequireValidator)
// add methods which throw errors when there's nothing matching the given id
addStaticSchemaMethods(userSchema)

module.exports = mongoose.model('User', userSchema)
