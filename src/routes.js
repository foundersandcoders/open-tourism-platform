const usersControllers = require('./controllers/users')

const router = require('express').Router()

// user routes
router.route('/users')
  .get(usersControllers.get)
  .post(usersControllers.post)
router.route('/users/:id')
  .get(usersControllers.getById)
  .put(usersControllers.update)
  .delete(usersControllers.delete)

module.exports = router
