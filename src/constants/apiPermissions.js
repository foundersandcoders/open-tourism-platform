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
    update: { authorizedRoles: [ roles.ADMIN, roles.OWNER ] },
    delete: { authorizedRoles: [ roles.SUPER, roles.OWNER ] },
    fields: {
      _id: [ roles.SUPER ],
      owner: [ roles.ADMIN ],
      verified: [ roles.ADMIN ]
    }
  },
  Product: {
    update: { authorizedRoles: [ roles.ADMIN, roles.OWNER ] },
    delete: { authorizedRoles: [ roles.SUPER, roles.OWNER ] },
    fields: {
      _id: [ roles.SUPER ],
      owner: [ roles.ADMIN ]
    }
  },
  Place: {
    update: { authorizedRoles: [ roles.ADMIN, roles.OWNER ] },
    delete: { authorizedRoles: [ roles.SUPER, roles.OWNER ] },
    fields: {
      _id: [ roles.SUPER ],
      owner: [ roles.ADMIN ],
      verified: [ roles.ADMIN ]
    }
  },
  Verify: { authorizedRoles: [ roles.ADMIN ] }
}
