const userControllers = require('./controllers/users')

const router = require('express').Router()

// user routes
router.route('/users')
  .get(userControllers.getAll)
  .post(userControllers.create)
router.route('/users/:id')
  .get(userControllers.getById)
  .put(userControllers.update)
  .delete(userControllers.delete)

module.exports = router
