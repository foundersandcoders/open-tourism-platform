const roles = require('../constants/roles.js')
const { auth } = require('../constants/errors.json')
const boom = require('boom')

// Recieves req.user from addUserIdToSession, and we extract the user's role from that
const rolePermissionIsSufficient = ({ minRole }) => user => {
  const rolesOrder = [roles.BASIC, roles.ADMIN, roles.SUPER]

  if (rolesOrder.indexOf(minRole) === -1) {
    throw boom.badImplementation()
  }

  return (rolesOrder.indexOf(user.role) >= rolesOrder.indexOf(minRole))
}

module.exports = opts => (req, res, next) => {
  if (!(rolePermissionIsSufficient(opts)(req.user))) {
    next(boom.unauthorized(auth.UNAUTHORIZED))
  }
  next()
}

// export functions for testing
module.exports.rolePermissionIsSufficient = rolePermissionIsSufficient
