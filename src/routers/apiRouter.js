const userController = require('../controllers/user')
const placeController = require('../controllers/place')
const eventController = require('../controllers/event')
const productController = require('../controllers/product')
const sessionController = require('../controllers/session')

const authSession = require('../middleware/authSession.js')
const authUser = require('../middleware/authUser.js')

const router = require('express').Router()

const roles = require('../constants/roles.js')

// user routes
router.route('/users')
  .get(userController.getAll)
  .post(userController.create)
router.route('/users/:id')
  .get(userController.getById)
  .put(userController.update)
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

router.route('/sessions/login')
  .post(sessionController.login)
router.route('/sessions/register')
  .post(sessionController.register)

router.route('/apps')
  .post(
    authSession(),
    authUser({
      minRole: roles.SUPER
    })
    // appsController.create
  )

module.exports = router
