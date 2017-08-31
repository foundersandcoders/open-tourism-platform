module.exports = (err, req, res, next) => {
  res.boom.badImplementation(err)
}
