const errorHandlers = module.exports = {}

errorHandlers.mongoError = (err, req, res, next) => {
  if (err.name !== 'MongoError') {
    return next(err)
  }
  console.log('mongo other error')
  return res.boom.badImplementation('An internal server error occurred')
}

errorHandlers.mongooseError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.boom.badRequest('Validation Failed', err.ValidationError) // adding more info as data (See boom docs)
  } else if (err.name === 'CastError') {
    return res.boom.badRequest('Invalid id', err.CastError)
  } else if (err.message === 'No document matching that id') {
    return res.boom.notFound(err.message)
  }
  console.log('mongoose other error')
  return res.boom.badImplementation('An internal server error occurred')
}
