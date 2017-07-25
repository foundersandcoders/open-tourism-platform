const createCustomDbError = message => {
  const err = new Error(message)
  err.name = 'CustomDbError'
  return err
}

// static method for Mongoose schema
const findByIdOrError = function (id) {
  return new Promise((resolve, reject) => {
    this.findById(id)
      .then(user => {
        if (!user) {
          return reject(createCustomDbError('No document matching that id'))
        }
        resolve(user)
      })
      .catch(reject)
  })
}

// static method for Mongoose schema
const findByIdAndUpdateOrError = function (id, data, options) {
  return new Promise((resolve, reject) => {
    this.findByIdAndUpdate(id, data, options)
      .then(user => {
        if (!user) {
          return reject(createCustomDbError('Cannot find document to update'))
        }
        resolve(user)
      })
      .catch(reject)
  })
}

// static method for Mongoose schema
const findByIdAndRemoveOrError = function (id, data, options) {
  return new Promise((resolve, reject) => {
    this.findByIdAndRemove(id)
      .then(user => {
        if (!user) {
          return reject(createCustomDbError('Cannot find document to delete'))
        }
        resolve(user)
      })
      .catch(reject)
  })
}

module.exports = {
  findByIdOrError,
  findByIdAndUpdateOrError,
  findByIdAndRemoveOrError
}
