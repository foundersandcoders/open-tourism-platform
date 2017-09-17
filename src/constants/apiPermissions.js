const roles = require('./roles')

module.exports = {
  User: {
    getAll: { minRole: roles.SUPER },
    getById: {
      minRole: roles.SUPER,
      ownerIsPermitted: true
    },
    create: { minRole: roles.SUPER },
    update: {
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
  },
  Event: {

  },
  Product: {

  },
  Place: {

  }
}
