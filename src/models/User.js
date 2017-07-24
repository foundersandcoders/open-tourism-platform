const mongoose = require('mongoose')

const { roles } = require('./constants.json')

const UserTranslatedFieldsSchema = mongoose.Schema(
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
    en: UserTranslatedFieldsSchema,
    ar: UserTranslatedFieldsSchema
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)
