const server = require('./server.js')

// load environment variables
if (process.NODE_ENV !== 'production') require('dotenv').config()

const port = process.env.PORT || 3000

// connect to the db
const dbConnection = require('../db/connect.js')

dbConnection.once('open', () => {
  // we're connected to the database
  server.listen(port, err => {
    if (err) {
      throw err
    }
    console.log(`Server listening on port ${port}`)
  })
})
