const jwt = require('express-jwt')

module.exports = (opts) => jwt(Object.assign({}, opts, {
  secret: process.env.JWT_SECRET
}))
