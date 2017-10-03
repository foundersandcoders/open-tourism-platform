// const roles = require('./roles')

module.exports = {
  User: {

  },
  Event: {
    update: { authorizedRoles: [ roles.ADMIN, roles.OWNER ] },
    delete: { authorizedRoles: [ roles.SUPER ] },
    fields: {
      _id: [ roles.SUPER ],
      owner: [ roles.ADMIN ]
    }
  },
  Product: {

  },
  Place: {

  }
}
