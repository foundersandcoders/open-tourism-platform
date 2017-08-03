module.exports = (err, req, res, next) => {
  if (err.isBoom) {
    return res.status(err.output.statusCode).send(err)
  }

  next()
}
