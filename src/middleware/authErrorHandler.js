const { names: errNames } = require('../constants/errors')

module.exports = (err, req, res, next) => {
  if (err.name !== errNames.UNAUTHORISED_JWT) {
    return next(err)
  }
  // remove the cookie and try again, solves expired cookie error
  if (req.cookies && req.cookies.token) {
    res.clearCookie('token')
    return res.redirect(req.originalUrl)
  }
  return next(err)
}
