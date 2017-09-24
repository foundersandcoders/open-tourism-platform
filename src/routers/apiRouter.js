const userController = require('../controllers/user')
const placeController = require('../controllers/place')
const eventController = require('../controllers/event')
const productController = require('../controllers/product')
const validateJWT = require('../middleware/validateJWT')
const validateHeaderToken = require('../middleware/validateHeaderToken')
const objectToDotNotation = require('../middleware/objectToDotNotation')

const router = require('express').Router()

// Use custom middleware that flattens req.body objects
router.use(objectToDotNotation)
// user routes
router.route('/users')
  .get(userController.getAll)
  .post(userController.create)
router.route('/users/:id')
  .get(userController.getById)
  .put(
    validateJWT(),
    validateHeaderToken,
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
