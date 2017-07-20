const errorHandlers = module.exports = {}

errorHandlers.mongoError = (err, req, res, next) => {
  if (!err.name === 'MongoError') {
    return next(err)
  }
  return res.send(err)
}

errorHandlers.mongooseError = (err, req, res, next) => {
  return res.send(err)
}
