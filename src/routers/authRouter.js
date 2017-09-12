const oauthController = require('../controllers/oauth')
const sessionController = require('../controllers/session')
const appsController = require('../controllers/apps')
const oauthClientController = require('../controllers/oauthClient')

const validateJWT = require('../middleware/validateJWT.js')
const validateUser = require('../middleware/validateUser.js')
const checkRole = require('../middleware/rolePermission.js')

const roles = require('../constants/roles.js')

const router = require('express').Router()

router.route('/login')
  .get(sessionController.getLoginPage)
  .post(sessionController.login)

router.route('/register')
  .get(sessionController.getRegisterPage)
  .post(sessionController.registerAndLogOn)

router.route('/oauth/authorize')
  .get(
    validateJWT({ credentialsRequired: false }),
    oauthController.getAuthorizePage
  )
  .post(validateJWT(), oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

router.route('/oauth/clients')
  .get(validateJWT(), oauthClientController.getAll)
  .post(validateJWT(), validateUser, oauthClientController.create)

// secure route with dummy handler for now
router.route('/apps')
  .get(
    validateJWT(),
    validateUser,
    checkRole({ minRole: roles.SUPER }),
    appsController.get
  )

module.exports = router
