const boom = require('boom')
const { messages: errMessages } = require('../constants/errors.json')

const { hasSufficientRole } = require('./permissions')

module.exports = fieldsPermissions => (req, res, next) => {
  const permissionedFields = Object.keys(fieldsPermissions)
  const unauthorizedFields = Object.keys(req.body)
    .filter(field => permissionedFields.includes(field))
    // filter out fields which are not permissioned
    .filter(field => {
      const { minRole, ownerIsPermitted } = fieldsPermissions[field]
      // filter down to fields which user is not permitted to write to
      return !hasSufficientRole({ minRole })(req.user) &&
        !(ownerIsPermitted && req.user && req.user.isResourceOwner)
    })

  if (unauthorizedFields.length > 0) {
    const message = errMessages.FIELD_UNAUTHORIZED + unauthorizedFields.join(', ')
    return next(boom.unauthorized(message))
  }

  next()
}
