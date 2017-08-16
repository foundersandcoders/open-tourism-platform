const oauthController = require('../controllers/oauth')

const router = require('express').Router()

router.route('/login')
  .get((req, res) => {
    const classes = {
      body: "helvetica bg-washed-blue",
      form: "center w-90 w-60-ns pa3",
      formTitle: "tc",
      formLabel: "db center ma3",
      formInput: "db w-100 pa1 ma1 br3",
      formSubmit: "db center bg-white br-pill pv2 ph3 ma4"
    }
    res.render('login', { classes })
  })

router.route('/oauth/authorize')
  .get(oauthController.getAuthorizePage)
  .post(oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

module.exports = router
