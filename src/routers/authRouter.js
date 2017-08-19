const oauthController = require('../controllers/oauth')
const sessionController = require('../controllers/session')
const appsController = require('../controllers/apps')

const authSession = require('../middleware/authSession.js')
const authUser = require('../middleware/authUser.js')

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
  .post(sessionController.register)

// secure route with dummy handler for now
router.route('/apps')
  .get(
    authSession(),
    authUser({
      minRole: roles.SUPER
    }),
    appsController.get
  )

module.exports = router
