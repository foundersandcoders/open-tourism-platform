const mongoose = require('mongoose')

const { roles } = require('./constants.json')
const { findByIdOrError, findByIdAndUpdateOrError, findByIdAndRemoveOrError } = require('../db/utils')

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    isPublic: { type: Boolean, required: true, default: true },
    organisationName: String,
    organisationDescription: String,
    imageUrl: String
  },
  {
    timestamps: true
  }
)

// methods which throw errors when there's nothing matching the given id
userSchema.statics.findByIdOrError = findByIdOrError
userSchema.statics.findByIdAndUpdateOrError = findByIdAndUpdateOrError
userSchema.statics.findByIdAndRemoveOrError = findByIdAndRemoveOrError

module.exports = mongoose.model('User', userSchema)
