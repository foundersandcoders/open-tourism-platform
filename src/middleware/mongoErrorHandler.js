const { names: errNames, codes: errCodes, messages: errMessages } = require('../constants/errors')

module.exports = (err, req, res, next) => {
  console.log('handling error mongo')

  // Mongo errors are of the form:
  // {
  //   name: 'MongoError',
  //   code: ...,
  //   MongoError: <full error stack>,
  //   message: ...,
  //   ...
  // }
  if (err.name !== errNames.MONGO) {
    return next(err)
  }
  switch (err.code) {
    case errCodes.MONGO_DUPLICATE_KEY:
      res.boom.badRequest(errMessages.DUPLICATE_KEY)
      break

    // unhandled mongo error
    default:
      res.boom.badImplementation(errMessages.UNHANDLED_MONGO)
  }
}
