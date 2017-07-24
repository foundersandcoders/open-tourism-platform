const errorHandlers = module.exports = {}

errorHandlers.customDbError = (err, req, res, next) => {
  if (err.name !== 'CustomDbError') {
    return next(err)
  }
  if (err.message === 'No document matching that id') {
    return res.boom.notFound(err.message)
  }
  if (err.message === 'Cannot find document to update') {
    return res.boom.badRequest(err.message)
  }
  return res.boom.badImplementation('An internal server error occurred')
}

errorHandlers.mongoError = (err, req, res, next) => {
  if (err.name !== 'MongoError') {
    return next(err)
  }
  return res.boom.badImplementation('An internal mongo server error occurred')
}

errorHandlers.mongooseError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.boom.badRequest('Validation Failed', err.ValidationError) // adding more info as data (See boom docs)
  } else if (err.name === 'CastError') {
    return res.boom.badRequest('Invalid id', err.CastError)
  }
  return res.boom.badImplementation('An internal mongoose server error occurred')
}
