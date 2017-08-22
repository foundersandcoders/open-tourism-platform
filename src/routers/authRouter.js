const oauthController = require('../controllers/oauth')
const sessionController = require('../controllers/session')
const appsController = require('../controllers/apps')

const validateJWT = require('../middleware/validateJWT.js')
const authenticateUser = require('../middleware/authenticateUser.js')
const checkRole = require('../middleware/rolePermission.js')

const roles = require('../constants/roles.js')

const router = require('express').Router()

router.route('/oauth/authorize')
  .get(oauthController.getAuthorizePage)
  .post(oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

router.route('/login')
  .post(sessionController.login)
router.route('/register')
  .post(sessionController.registerAndLogOn)

// secure route with dummy handler for now
router.route('/apps')
  .get(
    validateJWT(),
    authenticateUser,
    checkRole({ minRole: roles.SUPER }),
    appsController.get
  )

module.exports = router
