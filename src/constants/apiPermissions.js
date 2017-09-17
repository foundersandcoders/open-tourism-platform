const roles = require('./roles')

module.exports = {
  User: {
    put: {
      minRole: roles.ADMIN,
      ownerIsPermitted: true
    },
    delete: {
      minRole: roles.SUPER,
      ownerIsPermitted: false
    },
    fields: {
      _id: { minRole: roles.SUPER },
      username: { minRole: roles.SUPER, ownerIsPermitted: true }
    }
  }
}
