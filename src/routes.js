const userController = require('./controllers/user')

const router = require('express').Router()

// user routes
router.route('/users')
  .get(userController.getAll)
  .post(userController.create)
router.route('/users/:id')
  .get(userController.getById)
  .put(userController.update)
  .delete(userController.delete)

module.exports = router
