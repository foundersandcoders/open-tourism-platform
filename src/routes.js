const userController = require('./controllers/user')
const placeController = require('./controllers/place')
const eventController = require('./controllers/event')
const productController = require('./controllers/product')

const router = require('express').Router()

// user routes
router.route('/users')
  .get(userController.getAll)
  .post(userController.create)
router.route('/users/:id')
  .get(userController.getById)
  .put(userController.update)
  .delete(userController.delete)

  // place routes
router.route('/place')
  .get(placeController.getAll)
  .post(placeController.create)
router.route('/place/:id')
  .get(placeController.getById)
  .put(placeController.update)
  .delete(placeController.delete)

  // event routes
router.route('/event')
  .get(eventController.getAll)
  .post(eventController.create)
router.route('/event/:id')
  .get(eventController.getById)
  .put(eventController.update)
  .delete(eventController.delete)

  // product routes
router.route('/product')
  .get(productController.getAll)
  .post(productController.create)
router.route('/product/:id')
  .get(productController.getById)
  .put(productController.update)
  .delete(productController.delete)

module.exports = router
