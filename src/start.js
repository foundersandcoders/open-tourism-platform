require('../config.js')

const server = require('./server.js')

const port = process.env.PORT || 3000

// connect to the db
const dbConnection = require('./db/connect.js')

dbConnection.once('open', () => {
  // we're connected to the database
  server.listen(port, err => {
    if (err) {
      throw err
    }
    console.log(`Server listening on port ${port}`)
  })
})
