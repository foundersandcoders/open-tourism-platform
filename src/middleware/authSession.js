// This middleware looks for a JWT and uses it to populate req.users, just a wrapper for express-jwt
// which allows us to pass opts into it
const jwt = require('express-jwt')
const { getToken } = require('./authHelpers.js')

module.exports = (opts) => jwt(Object.assign({}, opts, {
  secret: process.env.JWT_SECRET,
  getToken
}))
