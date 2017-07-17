const express = require('express')
const router = require('./routes')
const bodyParser = require('body-parser')

const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json({ extended: true }))

server.use(router)

module.exports = server
