const express = require('express')
const router = require('./routes')
const bodyParser = require('body-parser')
const boom = require('express-boom')

const { mongoError, mongooseError } = require('./errorHandler.js')

const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ extended: true }))
server.use(boom())

server.use(router)

server.use(mongoError)
server.use(mongooseError)

module.exports = server
