const mongoose = require('mongoose')

const roles = ['BASIC', 'ADMIN', 'SUPER']

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

module.exports = mongoose.model('User', userSchema)
