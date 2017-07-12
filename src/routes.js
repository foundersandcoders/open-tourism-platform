const usersHandlers = require('./handlers/user')

const router = require('express').Router();

// user routes
router.get('/users', usersHandlers.get)
router.get('/users/:id', usersHandlers.getById)
router.post('/users', usersHandlers.post)
router.put('/users/:id', usersHandlers.update)
router.delete('/users/:id', usersHandlers.delete)

module.exports = router