// Middleware that validates JsonWebTokens and sets req.user.
// This is just a wrapper for express-jwt which allows us to pass options into it
const jwt = require('express-jwt')

const getToken = req => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token
  }
  return null
}

module.exports = opts => {
  const fixedOptions = {
    secret: process.env.JWT_SECRET,
    getToken
  }
  const jwtOptions = Object.assign(fixedOptions, opts)
  return jwt(jwtOptions)
}

module.exports.getToken = getToken
