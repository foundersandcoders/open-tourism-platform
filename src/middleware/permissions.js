const boom = require('boom')
const roles = require('../constants/roles.js')
const { auth, messages: errMessages } = require('../constants/errors.json')
const { rejectIfNull } = require('../db/utils')
const { oauthServer } = require('../controllers/oauth')

const hasSufficientRole = ({ minSufficientRole }) => user => {
  const orderedRoles = [roles.BASIC, roles.ADMIN, roles.SUPER]

  // throw error on initialisation if passed option is not valid
  if (!orderedRoles.includes(minSufficientRole)) {
    throw boom.badImplementation()
  }

  return orderedRoles.indexOf(user.role) >= orderedRoles.indexOf(minSufficientRole)
}

const checkUserOwnsResource = resourceType => resourceId => user => {
  resourceType.findById(resourceId)
  .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
  .then(doc => {
    // the 'owner' of a User is the user themself
    const ownerId = resourceType === User
      ? doc.id
      : doc.user
    return ownerId === user.id
      ? Promise.resolve()
      : Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
  })
}

module.exports =
  ({ minSufficientRole, resourceType, owningResourceIsSufficient }) => (req, res, next) => {
    // throw error on initialisation if passed options are not valid
    if (owningResourceIsSufficient && !resourceType) {
      throw boom.badImplementation()
    }

    if (!req.user) {
      return next(boom.unauthorized(auth.UNAUTHORIZED))
    } else if (hasSufficientRole({ minSufficientRole })(req.user)) {
      return next()
    } else if (!owningResourceIsSufficient) {
      return next(boom.unauthorized(auth.UNAUTHORIZED))
    } else {
      const resourceId = req.params.id
      return checkUserOwnsResource(resourceType)(resourceId)(req.user)
      .then(() => next())
      .catch(err => next(err))
    }
  }

// export functions for testing
module.exports.hasSufficientRole = hasSufficientRole
module.exports.checkUserOwnsResource = checkUserOwnsResource
