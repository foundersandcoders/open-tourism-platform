const dbErrorHandlers = module.exports = {}

dbErrorHandlers.custom = (err, req, res, next) => {
  if (err.name !== 'CustomDbError') {
    return next(err)
  }
  switch (err.message) {
    case 'No document matching that id':
      res.boom.notFound(err.message)
      break
    case 'Cannot find document to update':
      res.boom.badRequest(err.message)
      break
    case 'Cannot find document to delete':
      res.boom.badRequest(err.message)
      break

    // unhandled custom error
    default:
      res.boom.badImplementation('An internal server error occurred')
  }
}

dbErrorHandlers.mongo = (err, req, res, next) => {
  if (err.name !== 'MongoError') {
    return next(err)
  }
  // unhandled mongo error
  res.boom.badImplementation('An internal mongo server error occurred')
}

dbErrorHandlers.mongoose = (err, req, res, next) => {
  switch (err.name) {
    case 'ValidationError':
      res.boom.badRequest('Validation Failed', err.ValidationError) // trying to add more info as 'data' (See boom docs)
      break
    case 'CastError':
      res.boom.badRequest('Invalid id', err.CastError)
      break

    // unhandled mongoose error
    default:
      res.boom.badImplementation('An internal mongoose server error occurred')
  }
}
