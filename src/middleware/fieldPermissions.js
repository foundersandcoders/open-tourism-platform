const boom = require('boom')
const { messages: errMessages } = require('../constants/errors.json')

const { hasSufficientRole } = require('./permissions')

// const checkFieldPermission = permissionedFields => field =>

const getUnauthorizedFields = fieldPermissions => fieldsToChange => user => {
  const permissionedFields = Object.keys(fieldPermissions)
  return fieldsToChange
    // filter out fields which are not permissioned
    .filter(field => permissionedFields.includes(field))
      // filter down to fields which user is not permitted to write to
    .filter(field => {
      const { minRole, ownerIsPermitted } = fieldPermissions[field]
      return !hasSufficientRole({ minRole })(user) &&
        !(ownerIsPermitted && user && user.isResourceOwner)
    })
}

module.exports = fieldPermissions => (req, res, next) => {
  const permissionedFields = Object.keys(fieldPermissions)
  const fieldsToChange = Object.keys(req.body)

  const unauthorizedFields =
    getUnauthorizedFields(fieldPermissions)(fieldsToChange)(req.user)

  if (unauthorizedFields.length > 0) {
    const message = errMessages.FIELD_UNAUTHORIZED + unauthorizedFields.join(', ')
    return next(boom.unauthorized(message))
  }

  next()
}

module.exports.getUnauthorizedFields = getUnauthorizedFields