const { names: errNames, messages: errMessages } = require('../constants/errors')

module.exports = (err, req, res, next) => {
  // Mongoose errors have specific names, with each error name potentially having different structures
  // extracting more information about the error requires specific handling of that particular error name
  switch (err.name) {
    case errNames.MONGOOSE_VALIDATION:
      // Validation errors have a structure where further info about the specific way the validation failed
      // is stored in the errors key/value pair, as the ValidationError 'key' isn't actually a 'key'
      // eg
      // { ValidationError: Product validation failed: (en, ar): one of Path `en` or Path `ar` required.
      // errors:
      //  { '(en, ar)':
      //       {message: 'one of Path `en` or Path `ar` required',
      //       ...
      //       etc}
      // _message: 'Product validation failed',
      // name: 'ValidationError' }
      res.boom.badRequest(errMessages.VALIDATION_FAILED, { reasons: extractMongooseValidationMessages(err) })
      break
    case errNames.MONGOOSE_CAST:
      res.boom.badRequest(errMessages.INVALID_ID)
      break
    // unhandled
    default:
      next(err)
  }
}

const extractMongooseValidationMessages = mongooseErr => {
  return Object.keys(mongooseErr.errors).map(singleError => mongooseErr.errors[singleError].message)
}
