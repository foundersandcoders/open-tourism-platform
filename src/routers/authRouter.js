const oauthController = require('../controllers/oauth')

const router = require('express').Router()

router.route('/login')
  .get((req, res) => {
    res.render('login')
  })

router.route('/register')
  .get((req, res) => {
    res.render('register')
  })

router.route('/oauth/authorize')
  .get(oauthController.getAuthorizePage)
  .post(oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

module.exports = router
