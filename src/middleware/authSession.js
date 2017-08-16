// This middleware looks for a JWT and uses it to populate req.users, just a wrapper for express-jwt
// which allows us to pass opts into it
const jwt = require('express-jwt')

module.exports = (opts) => jwt(Object.assign({}, opts, {
  secret: process.env.JWT_SECRET,
  // Function to get the token, which will be decoded and used to populate req.user
  // atm it will check the headers, then query params, then cookies
  // We might need to get rid of the headers check if we end up putting the OAth token their?
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    } else if (req.cookies && req.cookies.token) {
      return req.cookies.token
    }
    return null
  }
}))
