// Set of helper functions to help with the permissioning middlewares

const url = require('url')
const boom = require('boom')
const roles = require('../constants/roles.js')
const { rejectIfNull } = require('../db/utils')
const { messages: errMessages } = require('../constants/errors.json')

const Event = require('../models/Event')
const Place = require('../models/Place')
const Product = require('../models/Product')
const User = require('../models/User')

const orderedRoles = [roles.BASIC, roles.ADMIN, roles.SUPER]

const hasSufficientRole = ({ minRole }) => user => {
  /**
  * Check's whether user's role is equal or higher than the minRole
  *
  * returns Boolean
  *
  * throws error on initialisation if passed option is not valid
  */

  if (!orderedRoles.includes(minRole)) {
    throw boom.badImplementation()
  }

  return user && (orderedRoles.indexOf(user.role) >= orderedRoles.indexOf(minRole))
}

const checkUserOwnsResource = resourceType => resourceId => user => {
  /**
  * Checks Ownership of a resource
  *
  * returns a Promise that resolves to true or false, or rejects if
  * resourceId is not found in DB (404)
  *
  * N.B. when the resource type itself is a User, the method is       * different but the returns are the same
  */

  if (resourceType === User) {
    return Promise.resolve(resourceId === user.id.toString())
  }

  return resourceType.findById(resourceId)
  .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
  .then(doc => {
    return doc.owner.toString() === user.id.toString()
  })
}

const getResourceType = req => {
  /**
  * Get the resource type of a resource, deduced from the req.url
  * resource type will be one of the models in the DB
  * Needs url to be of the form '/<resource>/:id'
  *
  * returns either a string (name of Model) or undefined
  *
  * For use when checking the ownership of a resource
  */

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
  /*
  * check an array of the fields a user is trying to change against   * against an array of those fields and their permission levels
  *
  * fieldPermissions should be an object with fields of a resource as  * the keys and the authorised roles as the values (in an array)
  * fieldsToChange should be an array of fields
  * user is a user object that needs to have role and isResourceOwner
  *
  * returns an array of fields which the given user is attempting to  * change but is not authorised to do so
  */

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
