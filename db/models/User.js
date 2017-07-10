const mongoose = require('mongoose')

const roles = ['BASIC', 'ADMIN', 'SUPER']

const userSchema = mongoose.Schema(
  {
    isPublic: Boolean,
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    name: { type: String, required: true },
    organisationName: { type: String, required: false },
    organisationDescription: { type: String, required: false },
    email: { type: String, required: true },
    role: { type: String, enum: roles, required: true},
    imageUrl: { type: String, required: false }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)
