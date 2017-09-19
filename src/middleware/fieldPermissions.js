const boom = require('boom')
const { messages: errMessages } = require('../constants/errors.json')
const { hasSufficientRole } = require('./permissions')
const roles = require('../constants/roles.js')

const orderedRoles = [roles.BASIC, roles.ADMIN, roles.SUPER]

const getUnauthorizedFields = fieldPermissions => fieldsToChange => user => {
  const permissionedFields = Object.keys(fieldPermissions)

  return fieldsToChange
    // filter out fields which are not permissioned
    .filter(field => permissionedFields.includes(field))
      // filter down to fields which user is not permitted to write to
    .filter(field => {
      const [ minRole, ownerIsPermitted ] = fieldPermissions[field]
      return !hasSufficientRole({ minRole })(user) &&
        !(ownerIsPermitted && user && user.isResourceOwner)
    })
}

module.exports = fieldPermissions => {
  // fieldPermissions should be an object with the following form
  // {
  //   fieldName: [ minRole [, OWNER] ]
  // }
  const permissionedFields = Object.keys(fieldPermissions)

  // check supplied fieldPermissions are in correct form
  permissionedFields.forEach(field => {
    const [ minRole, owner ] = fieldPermissions[field]
    const ownerIsPermitted = !!owner

    if (!orderedRoles.includes(minRole)) {
      throw boom.badImplementation()
    }
    if (owner && owner !== roles.OWNER) {
      throw boom.badImplementation()
    }
  })

  return (req, res, next) => {
    const fieldsToChange = Object.keys(req.body)

    const unauthorizedFields =
      getUnauthorizedFields(fieldPermissions)(fieldsToChange)(req.user)

    if (unauthorizedFields.length > 0) {
      const message = errMessages.FIELD_UNAUTHORIZED + unauthorizedFields.join(', ')
      return next(boom.unauthorized(message))
    }

    next()
  }
}

module.exports.getUnauthorizedFields = getUnauthorizedFields
