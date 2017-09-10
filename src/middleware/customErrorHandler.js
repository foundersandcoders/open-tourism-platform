const { names: errNames, messages: errMessages } = require('../constants/errors')

module.exports = (err, req, res, next) => {
  if (err.name !== errNames.CUSTOM) {
    return next(err)
  }
  switch (err.message) {
    case errMessages.GET_ID_NOT_FOUND:
      res.boom.notFound(err.message)
      break
    case errMessages.UPDATE_ID_NOT_FOUND:
      res.boom.badRequest(err.message)
      break
    case errMessages.DELETE_ID_NOT_FOUND:
      res.boom.badRequest(err.message)
      break
    case errMessages.INCORRECT_CLIENT_ID:
      res.boom.badRequest(err.message)
      break

    // unhandled custom error
    default:
      res.boom.badImplementation(errMessages.UNHANDLED_CUSTOM)
  }
}
