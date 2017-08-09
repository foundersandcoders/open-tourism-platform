const express = require('express')
const apiRouter = require('./routers/apiRouter')
const authRouter = require('./routers/authRouter')
const bodyParser = require('body-parser')
const boom = require('express-boom')
const path = require('path')

const customErrorHandler = require('./middleware/customErrorHandler')
const mongoErrorHandler = require('./middleware/mongoErrorHandler')
const mongooseErrorHandler = require('./middleware/mongooseErrorHandler')
const finalErrorHandler = require('./middleware/finalErrorHandler')
const server = express()

server.use(express.static(path.join(__dirname, 'public')))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ extended: true }))
server.use(boom())

server.use(apiRouter)
server.use('/oauth', authRouter)

server.use(customErrorHandler)
server.use(mongoErrorHandler)
server.use(mongooseErrorHandler)
server.use(finalErrorHandler)

module.exports = server
