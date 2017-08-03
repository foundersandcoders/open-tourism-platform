const express = require('express')
const router = require('./routes')
const bodyParser = require('body-parser')
const boom = require('express-boom')

const customErrorHandler = require('./middleware/customErrorHandler')
const mongoErrorHandler = require('./middleware/mongoErrorHandler')
const mongooseErrorHandler = require('./middleware/mongooseErrorHandler')
const boomErrorHandler = require('./middleware/boomErrorHandler')

const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ extended: true }))
server.use(boom())

server.use(router)

server.use(customErrorHandler)
server.use(mongoErrorHandler)
server.use(mongooseErrorHandler)
server.use(boomErrorHandler)

module.exports = server
