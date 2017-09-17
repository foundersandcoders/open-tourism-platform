const roles = require('./roles')

module.exports = {
  User: {

  },
  Event: {
    update: {
      minRole: roles.ADMIN
      ownerIsPermitted: true  
    },
    delete: {
      minRole: roles.SUPER
    },
    fields: {
      _id: { minRole: roles.SUPER },
      owner: { minRole: roles.ADMIN }
    }
  },
  Product: {

  },
  Place: {

  }
}
