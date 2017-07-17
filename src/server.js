const express = require('express')
const router = require('./routes')
const bodyParser = require('body-parser')

const server = express()

server.use(bodyParser.urlencoded())
server.use(bodyParser.json())

server.use(router)

module.exports = server
