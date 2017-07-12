const express = require('express')
const router = require('./routes')

const server = express()

server.use(router)

module.exports = server
