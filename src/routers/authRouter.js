const oauthController = require('../controllers/oauth')

const router = require('express').Router()

router.route('/login')
  .get((req, res) => {
    res.render('login')
  })

router.route('/oauth/register-app')
  .get((req, res) => res.render('oauth/register-app'))
  // TODO
  .post((req, res) => res.send('TODO'))

router.route('/oauth/authorize')
  .get(oauthController.getAuthorizePage)
  .post(oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

module.exports = router
