const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const boom = require('boom')
const isProduction = process.env.NODE_ENV === 'production'

const Users = require('../models/User.js')
const roles = require('../constants/roles.js')
const { auth: authErr } = require('../constants/errors.json')

const makeLoggedInToken = user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        username: user.username,
        scope: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      },
      (err, token) => {
        if (err) return reject(err)

        resolve(token)
      }
    )
  })
}

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {isSecure: isProduction, httpOnly: isProduction})
}

const sessionController = module.exports = {}

sessionController.register = (req, res, next) => {
  Users.findOne({ username: req.body.username }).then(notNewUsername => {
    if (notNewUsername) {
      return Promise.reject(boom.badRequest('username already exists'))
    }
    return bcrypt.hash(req.body.password, 12)
  }).then(passwordHash => {
    const { englishName, arabicName, email, username, imageUrl } = req.body
    const en = englishName && { name: englishName }
    const ar = arabicName && { name: arabicName }
    return Users.create(
      {
        username,
        password: passwordHash,
        role: roles.BASIC,
        email,
        imageUrl,
        ar,
        en
      }
    )
  }).then(makeLoggedInToken).then(token => {
    setTokenCookie(res, token)
    res.send('registered!')
  }).catch(next)
}

sessionController.login = (req, res, next) => {
  Users.findOne({ username: req.body.username }).then(existingUser => {
    if (!existingUser) return Promise.reject(boom.badRequest(authErr.WRONGUSERORPW))
    return bcrypt.compare(req.body.password, existingUser.password).then(match => {
      if (!match) return Promise.reject(boom.badRequest(authErr.WRONGUSERORPW))
      return existingUser
    })
  }).then(makeLoggedInToken).then(token => {
    setTokenCookie(res, token)
    res.send('success')
  }).catch(next)
}
