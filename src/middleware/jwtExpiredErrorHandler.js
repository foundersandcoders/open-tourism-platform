const { names: errNames, messages: errMessages } = require('../constants/errors')

module.exports = (err, req, res, next) => {
  if (err.name !== errNames.UNAUTHORISED_JWT) {
    return next(err)
  }

  switch (err.message) {
    case errMessages.EXPIRED_JWT:
      res.clearCookie('token')
      res.redirect(req.originalUrl)
      break
    default:
      next(err)
  }
}
