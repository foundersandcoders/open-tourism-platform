const url = require('url')
const boom = require('boom')
const roles = require('../constants/roles.js')
const { auth, messages: errMessages } = require('../constants/errors.json')
const { rejectIfNull } = require('../db/utils')

const Event = require('../models/Event')
const Place = require('../models/Place')
const Product = require('../models/Product')
const User = require('../models/User')

const hasSufficientRole = ({ minRole }) => user => {
  const orderedRoles = [roles.BASIC, roles.ADMIN, roles.SUPER]

  // throw error on initialisation if passed option is not valid
  if (!orderedRoles.includes(minRole)) {
    throw boom.badImplementation()
  }

  return user && (orderedRoles.indexOf(user.role) >= orderedRoles.indexOf(minRole))
}

const checkUserOwnsResource = resourceType => resourceId => user => {
  if (resourceType === User) {
    return resourceId === user.id.toString()
      ? Promise.resolve()
      : Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
  }

  return resourceType.findById(resourceId)
  .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
  // currently using toString(), may be better to use <mongoid>.equals(<mongoid>)
  .then(doc => doc.owner.toString() === user.id.toString()
    ? Promise.resolve()
    : Promise.reject(boom.unauthorized(auth.UNAUTHORIZED))
  )
}

const getResourceType = req => {
  // currently needs url to be of the form '/<resource>/:id'
  const routeResourceMapping = {
    events: Event,
    places: Place,
    products: Product,
    users: User
  }
  const pathName = url.parse(req.url).pathname
  return routeResourceMapping[pathName.split('/')[1]]
}

module.exports =
  ({ minRole, ownerIsPermitted }) => (req, res, next) => {
    const resourceType = getResourceType(req)

    if (ownerIsPermitted && !resourceType) {
      next(boom.badImplementation())
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
    .then(() => {
      req.user.isResourceOwner = true
      next()
    })
    .catch(err => next(err))
    
  }

// export functions for testing
module.exports.hasSufficientRole = hasSufficientRole
module.exports.checkUserOwnsResource = checkUserOwnsResource
