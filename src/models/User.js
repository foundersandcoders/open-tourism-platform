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

// Our own static method in order to make it throw an error when it doesn't find something matching a valid ID
userSchema.statics.findByIdOrError = function (id) {
  return new Promise((resolve, reject) => {
    this.findById(id)
      .then(user => {
        if (!user) {
          const noIdErr = new Error('No document matching that id')
          noIdErr.name = 'Custom DB error'
          return reject(noIdErr)
        }
        resolve(user)
      })
      .catch(reject)
  })
}

module.exports = mongoose.model('User', userSchema)
