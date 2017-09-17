const userController = require('../controllers/user')
const placeController = require('../controllers/place')
const eventController = require('../controllers/event')
const productController = require('../controllers/product')

const validateJWT = require('../middleware/validateJWT')
const validateHeaderToken = require('../middleware/validateHeaderToken')
const validateUser = require('../middleware/validateUser')
const permissions = require('../middleware/permissions')
const fieldPermissions = require('../middleware/fieldPermissions')

const api = require('../constants/apiPermissions')
const roles = require('../constants/roles')

const router = require('express').Router()

// user routes
router.route('/users')
  .get( 
    validateJWT(),
    validateUser(),
    validateHeaderToken,
    permissions(api.User.getAll),
    userController.getAll
  )
  .post(
    // validateJWT(),
    // validateUser(),
    // validateHeaderToken,
    // fieldPermissions(api.User.fields),
    userController.create
  )

router.route('/users/:id')
  .get(userController.getById)
  .put(
    // validateJWT(),
    // validateUser(),
    // validateHeaderToken,
    // permissions(api.User.put),
    // fieldPermissions(api.User.fields),
    userController.update
  )
  .delete(userController.delete)

  // place routes
router.route('/places')
  .get(placeController.getAll)
  .post(placeController.create)
router.route('/places/:id')
  .get(placeController.getById)
  .put(placeController.update)
  .delete(placeController.delete)

  // event routes
router.route('/events')
  .get(eventController.getAll)
  .post(eventController.create)
router.route('/events/:id')
  .get(eventController.getById)
  .put(eventController.update)
  .delete(eventController.delete)

  // product routes
router.route('/products')
  .get(productController.getAll)
  .post(productController.create)
router.route('/products/:id')
  .get(productController.getById)
  .put(productController.update)
  .delete(productController.delete)

module.exports = router
