module.exports = (err, req, res, next) => {
  // log this error in heroku logs so we can see what it is
  console.log(err)
  res.boom.badImplementation(err)
}
