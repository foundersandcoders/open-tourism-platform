const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('UserTests', userSchema)
