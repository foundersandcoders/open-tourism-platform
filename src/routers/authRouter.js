const oauthController = require('../controllers/oauth')
const sessionController = require('../controllers/session')

const validateJWT = require('../middleware/validateJWT.js')

const router = require('express').Router()

router.route('/login')
  .get(sessionController.getLoginPage)
  .post(sessionController.login)

router.route('/register')
  .get(sessionController.getRegisterPage)
  .post(sessionController.registerAndLogOn)

router.route('/oauth/register-app')
  .get((req, res) => res.render('oauth/register-app'))
  // TODO
  .post((req, res) => res.send('TODO'))

router.route('/oauth/authorize')
  .get(
    validateJWT(),
    oauthController.getAuthorizePage
  )
  .post(validateJWT({ credentialsRequired: true }), oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

module.exports = router
