const express = require('express')
const router = require('./routes')
const bodyParser = require('body-parser')

const { mongoError, mongooseError } = require('./errorHandler.js')

const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ extended: true }))

server.use(router)

server.use(mongoError)
server.use(mongooseError)

module.exports = server
