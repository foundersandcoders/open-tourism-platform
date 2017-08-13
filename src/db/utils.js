const { messages: errMessages, names: errNames } = require('../constants/errors')

const createCustomDbError = message => {
  const err = new Error(message)
  err.name = errNames.CUSTOM
  return err
}

const rejectIfEmpty = message => res =>
  res === null
    ? Promise.reject(createCustomDbError(message))
    : res

// static method for Mongoose schema
const findByIdOrError = function (id) {
  return this.findById(id)
    .then(res => {
      if (res === null) {
        return Promise.reject(createCustomDbError(errMessages.GET_ID_NOT_FOUND))
      }
      return Promise.resolve(res)
    })
}

// static method for Mongoose schema
const findByIdAndUpdateOrError = function (id, data, options) {
  return this.findByIdAndUpdate(id, data, options)
    .then(res => {
      if (res === null) {
        return Promise.reject(createCustomDbError(errMessages.UPDATE_ID_NOT_FOUND))
      }
      return Promise.resolve(res)
    })
}

// static method for Mongoose schema
const findByIdAndRemoveOrError = function (id, data, options) {
  return this.findByIdAndRemove(id)
    .then(res => {
      if (res === null) {
        return Promise.reject(createCustomDbError(errMessages.DELETE_ID_NOT_FOUND))
      }
      Promise.resolve(res)
    })
}

const addStaticSchemaMethods = schema => {
  schema.statics.findByIdOrError = findByIdOrError
  schema.statics.findByIdAndUpdateOrError = findByIdAndUpdateOrError
  schema.statics.findByIdAndRemoveOrError = findByIdAndRemoveOrError
}

const customRequireValidator = function (next) {
  if (!this.en && !this.ar) {
    this.invalidate('(en, ar)', 'one of Path `en` or Path `ar` required')
  }
  next()
}

module.exports = {
  addStaticSchemaMethods,
  customRequireValidator,
  rejectIfEmpty
}
