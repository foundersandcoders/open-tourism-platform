const errorHandlers = module.exports = {}

errorHandlers.mongoError = (err, req, res, next) => {
  if (err.name !== 'MongoError') {
    return next(err)
  }
  return res.boom.badImplementation('An internal server error occurred')
}

errorHandlers.mongooseError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.boom.badRequest('Validation Failed', err.ValidationError)
  }
}
