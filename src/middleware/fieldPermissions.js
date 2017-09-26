const boom = require('boom')
const { messages: errMessages } = require('../constants/errors.json')
const roles = require('../constants/roles.js')
const { orderedRoles, getUnauthorizedFields, getResourceType, checkUserOwnsResource }
  = require('../helpers/permissions')

module.exports = fieldPermissions => {
  // fieldPermissions should be an object with the following form
  // {
  //   fieldName: [ minRole [, OWNER] ]
  // }
  const permissionedFields = Object.keys(fieldPermissions)

  // check supplied fieldPermissions are in correct form
  permissionedFields.forEach(field => {
    const [ minRole, owner ] = fieldPermissions[field]
    // const ownerIsPermitted = !!owner

    if (!orderedRoles.includes(minRole)) {
      throw boom.badImplementation()
    }
    if (owner && owner !== roles.OWNER) {
      throw boom.badImplementation()
    }
  })

  return (req, res, next) => {
    const fieldsToChange = Object.keys(req.body)
    const user = req.user
    const resourceType = getResourceType(req)
    const resourceId = req.params.id

    checkUserOwnsResource(resourceType)(resourceId)(user)
    .then(() => {
      req.user.isResourceOwner = true
      return Promise.resolve()
    })
    // we want to continue even if the user doesn't own the resource
    .catch(() => Promise.resolve())
    .then(() => {
      const unauthorizedFields =
        getUnauthorizedFields(fieldPermissions)(fieldsToChange)(user)

      if (unauthorizedFields.length > 0) {
        const message = errMessages.FIELD_UNAUTHORIZED + unauthorizedFields.join(', ')
        return next(boom.unauthorized(message))
      }
      next()
    })

  }
}
