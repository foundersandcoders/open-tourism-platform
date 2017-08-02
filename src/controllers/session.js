const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Users = require('../models/User.js')
const roles = require('../constants/roles.js')

const sessionController = module.exports = {}

sessionController.register = (req, res, next) => {
  Users.find({ username: req.body.username }).then(user => {
    if (user.length === 0) {
      return bcrypt.hash(req.body.password, 12)
    }

    res.boom.badRequest('username already exists')
  }).then(passwordHash => {
    const { englishName, arabicName, email, username, imageUrl } = req.body
    const en = englishName && { name: englishName }
    const ar = arabicName && { name: arabicName }
    return Users.create(Object.assign(
      {
        username: username,
        password: passwordHash,
        role: roles.BASIC,
        email: email,
        imageUrl: imageUrl
      },
      { ar },
      { en }
    ))
  }).then(user => {
    res.send('registered!')
  }).catch(next)
}

sessionController.login = (req, res, next) => {
  Users.find({ username: req.body.username }).then(users => {
    if (users.length !== 0) {
      return bcrypt.compare(req.body.password, users[0].password).then(match => {
        if (match) return users[0]

        res.boom.badRequest('username / password combination do not exist')
      })
    }
  }).then(user => {
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
  }).then(token => {
    res.header('authorization', `Bearer ${token}`)

    res.send('success')
  }).catch(next)
}
