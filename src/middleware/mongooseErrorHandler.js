const { names: errNames, messages: errMessages } = require('../constants/errors')

module.exports = (err, req, res, next) => {
  // Mongoose errors have specific names, and more info is stored under the key with the error name
  // e.g. err = {
  //   name: 'ValidationError',
  //   ValidationError: ...,
  //   ...
  // }
  switch (err.name) {
    case errNames.MONGOOSE_VALIDATION:
      res.boom.badRequest(errMessages.VALIDATION_FAILED, err[err.name]) // trying to add more info as 'data' (See boom docs)
      break
    case errNames.MONGOOSE_CAST:
      res.boom.badRequest(errMessages.INVALID_ID, err[err.name])
      break

    // unhandled mongoose error
    default:
      res.boom.badImplementation(errMessages.UNHANDLED_MONGOOSE)
  }
}
