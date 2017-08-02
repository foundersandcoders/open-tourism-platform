const express = require('express')
const router = require('./routes')
const authRouter = require('./auth')
const bodyParser = require('body-parser')
const boom = require('express-boom')
const path = require('path')

const customErrorHandler = require('./middleware/customErrorHandler')
const mongoErrorHandler = require('./middleware/mongoErrorHandler')
const mongooseErrorHandler = require('./middleware/mongooseErrorHandler')

const server = express()

server.use(express.static(path.join(__dirname, 'public')))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ extended: true }))
server.use(boom())

server.use(router)
server.use(authRouter)

server.use(customErrorHandler)
server.use(mongoErrorHandler)
server.use(mongooseErrorHandler)
server.use((err, req, res, next) => {
  console.error(err)
  res.boom.badImplementation()
})

module.exports = server
