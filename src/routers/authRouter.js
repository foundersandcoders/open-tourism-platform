const oauthController = require('../controllers/oauth')

const router = require('express').Router()

router.route('/authorize')
  .get(oauthController.getAuthorizePage)
  .post(oauthController.getAuthorizationCode)

router.route('/token')
  .post(oauthController.getToken)

module.exports = router
