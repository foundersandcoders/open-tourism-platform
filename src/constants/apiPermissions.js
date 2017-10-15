const roles = require('./roles')

module.exports = {
  User: {

  },
  Event: {

  },
  Product: {

  },
  Place: {
    update: { authorizedRoles: [ roles.ADMIN, roles.OWNER ] },
    delete: { authorizedRoles: [ roles.SUPER, roles.OWNER ] },
    fields: {
      _id: [ roles.SUPER ],
      owner: [ roles.ADMIN ]
    }
  }
}
