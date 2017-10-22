const roles = require('./roles')

module.exports = {
  User: {
    getAll: [roles.SUPER],
    getById: [ roles.SUPER, roles.OWNER ],
    create: [ roles.SUPER ],
    update: [ roles.ADMIN, roles.OWNER ],
    delete: [ roles.SUPER ],
    fields: {
      _id: [ roles.SUPER ],
      username: [ roles.SUPER, roles.OWNER ],
      role: [ roles.SUPER ],
      password: [ roles.SUPER ]
    }
  },
  Event: {

  },
  Product: {

  },
  Place: {

  }
}
