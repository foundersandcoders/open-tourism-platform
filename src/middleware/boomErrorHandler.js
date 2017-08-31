module.exports = (err, req, res, next) => {
  if (!err.isBoom) {
    return next(err)
  }
  res.status(err.output.statusCode)
  return res.send(err.output.payload)
}
