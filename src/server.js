const express = require('express')
const router = require('./routes')
const bodyParser = require('body-parser')
const boom = require('express-boom')

const dbErrorHandlers = require('./dbErrorHandlers')

const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ extended: true }))
server.use(boom())

server.use(router)

server.use(dbErrorHandlers.custom)
server.use(dbErrorHandlers.mongo)
server.use(dbErrorHandlers.mongoose)

module.exports = server
