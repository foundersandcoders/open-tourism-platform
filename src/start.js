const mongoose = require('mongoose')
const server = require('./server.js')

// connect to the db
const dbConnection = require('../db/connect.js')

const port = process.env.PORT || 3000

dbConnection.once('open', () => {
  // we're connected to the database
  server.listen(port, err => {
    if (err) {
      throw err
    }
    console.log(`Server listening on port ${port}`)
  })
})
