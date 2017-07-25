const createCustomDbError = message => {
  const err = new Error(message)
  err.name = 'CustomDbError'
  return err
}

// static method for Mongoose schema
const findByIdOrError = function (id) {
  return this.findById(id)
    .then(res => {
      if (res === null) {
        return Promise.reject(createCustomDbError('No document matching that id'))
      }
      return Promise.resolve(res)
    })
    .catch(err => Promise.reject(err))
}

// static method for Mongoose schema
const findByIdAndUpdateOrError = function (id, data, options) {
  return this.findByIdAndUpdate(id, data, options)
    .then(res => {
      if (res === null) {
        return Promise.reject(createCustomDbError('Cannot find document to update'))
      }
      return Promise.resolve(res)
    })
    .catch(err => Promise.reject(err))
}

// static method for Mongoose schema
const findByIdAndRemoveOrError = function (id, data, options) {
  return this.findByIdAndRemove(id)
    .then(res => {
      if (res === null) {
        return Promise.reject(createCustomDbError('Cannot find document to delete'))
      }
      Promise.resolve(res)
    })
    .catch(err => Promise.reject(err))
}

const addStaticSchemaMethods = schema => {
  schema.statics.findByIdOrError = findByIdOrError
  schema.statics.findByIdAndUpdateOrError = findByIdAndUpdateOrError
  schema.statics.findByIdAndRemoveOrError = findByIdAndRemoveOrError
}

module.exports = {
  addStaticSchemaMethods
}
