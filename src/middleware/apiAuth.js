const boom = require('boom')
const roles = require('../constants/roles.js')
const { auth, messages: errMessages } = require('../constants/errors.json')
const { rejectIfNull } = require('../db/utils')
const { oauthServer } = require('../controllers/oauth')

const checkUserRole =
  ({ minSufficientRole, resource, resourceOwnerIsSufficient }) => req => {
    const orderedRoles = [roles.BASIC, roles.ADMIN, roles.SUPER]

  // throw error on initialisation if passed options are not valid
    if (!orderedRoles.includes(minSufficientRole)) {
      throw boom.badImplementation()
    }
    if (resourceOwnerIsSufficient && (!resource || !req.params.id)) {
      throw boom.badImplementation()
    }

    if (orderedRoles.indexOf(req.user.role) >= orderedRoles.indexOf(minSufficientRole)) {
      return Promise.resolve()
    } else if (!resourceOwnerIsSufficient) {
      return Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
    } else {
      const resourceId = req.params.id
      return resource.findById(resourceId)
      .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
      .then(doc => doc.user === req.user.id
        ? Promise.resolve()
        : Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
      )
    }
  }

module.exports = opts => (req, res, next) => {
  
  // oauthServer.authenticate()
  // .then(token => {
  //   // checkUserRole(opts)(req)
  //   // .then(res => next())
  //   // .catch(err => next(err))
  // })
  // .catch(err => next(err))

  next()
}
