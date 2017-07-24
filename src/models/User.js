const mongoose = require('mongoose')

const { roles } = require('./constants.json')

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

userSchema.statics.findByIdOrError = function (id) {
  return new Promise((resolve, reject) => {
    this.findById(id)
      .then(user => {
        if (!user) {
          return reject(new Error('No document matching that id'))
        }
        resolve(user)
      })
      .catch(reject)
  })
}

module.exports = mongoose.model('User', userSchema)
