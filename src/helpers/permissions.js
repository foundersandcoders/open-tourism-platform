const url = require('url')
const boom = require('boom')
const roles = require('../constants/roles.js')
const { rejectIfNull } = require('../db/utils')
const { auth, messages: errMessages } = require('../constants/errors.json')

const Event = require('../models/Event')
const Place = require('../models/Place')
const Product = require('../models/Product')
const User = require('../models/User')

const orderedRoles = [roles.BASIC, roles.ADMIN, roles.SUPER]

const hasSufficientRole = ({ minRole }) => user => {
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

const getUnauthorizedFields = fieldPermissions => fieldsToChange => user => {
  const permissionedFields = Object.keys(fieldPermissions)

  return fieldsToChange
    // filter out fields which are not permissioned
    .filter(field => permissionedFields.includes(field))
      // filter down to fields which user is not permitted to change
    .filter(field => {
      const [ minRole, ownerIsPermitted ] = fieldPermissions[field]

      if (hasSufficientRole({ minRole })(user)) {
        return false
      }
      if (ownerIsPermitted && user && user.isResourceOwner) {
        return false
      }

      return true
    })
}

module.exports = {
  orderedRoles,
  hasSufficientRole,
  checkUserOwnsResource,
  getResourceType,
  getUnauthorizedFields
}
