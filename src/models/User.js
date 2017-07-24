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

const customDbError = message => {
  const err = new Error(message)
  err.name = 'CustomDbError'
  return err
}

const findByIdOrError = function (id) {
  return new Promise((resolve, reject) => {
    this.findById(id)
      .then(user => {
        if (!user) {
          return reject(customDbError('No document matching that id'))
        }
        resolve(user)
      })
      .catch(reject)
  })
}

const findByIdAndUpdateOrError = function (id, data, options) {
  return new Promise((resolve, reject) => {
    this.findByIdAndUpdate(id, data, options)
      .then(user => {
        if (!user) {
          return reject(customDbError('No document matching that id'))
        }
        resolve(user)
      })
      .catch(reject)
  })
}

// Our own static method in order to make it throw an error when it doesn't find something matching a valid ID
userSchema.statics.findByIdOrError = findByIdOrError
userSchema.statics.findByIdAndUpdateOrError = findByIdAndUpdateOrError

module.exports = mongoose.model('User', userSchema)
