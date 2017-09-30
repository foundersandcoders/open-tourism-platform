// A middleware to check whether a user is authorised to access a route, whether as owner or an
// authorised role

const boom = require('boom')
const { auth } = require('../constants/errors.json')
const roles = require('../constants/roles')
const {
  orderedRoles,
  hasSufficientRole,
  checkUserOwnsResource,
  getResourceType
} = require('../helpers/permissions')

module.exports = ({ authorizedRoles }) => {
  /*
  *
  * Given the authorized roles, return a middleware to either let a
  * user through, or reject as unauthorized.
  *
  * authorizedRoles should be an array [ minRole [, OWNER] ]
  *  - minRole should be one of the fixed roles
  *  - OWNER is optional, its appearance indicating the resource owner
  * is also permitted even if not having the given minRole
  *
  * can be used independently or in conjunction with the
  * fieldPermission.js middlewarae
  */
  const [ minRole, owner ] = authorizedRoles
  const ownerIsPermitted = !!owner

  if (!orderedRoles.includes(minRole)) {
    throw boom.badImplementation()
  }

  if (owner && owner !== roles.OWNER) {
    throw boom.badImplementation()
  }

  return (req, res, next) => {
    const resourceType = getResourceType(req)

    if (ownerIsPermitted && !resourceType) {
      return next(boom.badImplementation())
    }

    if (!req.user || !req.user.id) {
      return next(boom.unauthorized(auth.UNAUTHORIZED))
    }

    if (hasSufficientRole({ minRole })(req.user)) {
      return next()
    }

    if (!ownerIsPermitted) {
      return next(boom.unauthorized(auth.UNAUTHORIZED))
    }

    const resourceId = req.params.id
    return checkUserOwnsResource(resourceType)(resourceId)(req.user)
    .then((isOwner) => {
      if (isOwner) {
        req.user.isResourceOwner = true
        return next()
      } else {
        return next(boom.unauthorized(auth.UNAUTHORIZED))
      }
    })
    .catch(err => next(err))
  }
}
