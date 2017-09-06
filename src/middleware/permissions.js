const boom = require('boom')
const roles = require('../constants/roles.js')
const { auth, messages: errMessages } = require('../constants/errors.json')
const { rejectIfNull } = require('../db/utils')
const { oauthServer } = require('../controllers/oauth')

const checkUserIsPermitted =
  ({ minSufficientRole, resource, resourceOwnerIsSufficient }) => (user, resourceId) => {
    const orderedRoles = [roles.BASIC, roles.ADMIN, roles.SUPER]

    // throw error on initialisation if passed options are not valid
    if (!orderedRoles.includes(minSufficientRole)) {
      throw boom.badImplementation()
    }
    if (resourceOwnerIsSufficient && !resource) {
      throw boom.badImplementation()
    }

    if (orderedRoles.indexOf(user.role) >= orderedRoles.indexOf(minSufficientRole)) {
      return Promise.resolve()
    } else if (!resourceOwnerIsSufficient) {
      return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
    } else {
      return resource.findById(resourceId)
      .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
      .then(doc => doc.user === user.id
        ? Promise.resolve()
        : Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
      )
    }
  }

module.exports = opts => (req, res, next) => {
  checkUserIsPermitted(opts)(req.user, req.params.id)
  .then(() => next())
  .catch(err => next(err))
}
