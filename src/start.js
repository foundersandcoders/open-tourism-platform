const mongoose = require('mongoose')
const server = require('./server.js')

// connect to the db
require('../db/connect.js')
const db = mongoose.connection

const port = process.env.PORT || 3000

db.on('error', err => console.log('connection error: ' + err))

db.once('open', () => {
  // we're connected to the database
  server.listen(port, err => {
    if (err) {
      throw err
    }
    console.log(`Server listening on port ${port}`)

    const User = require('../db/models/User.js')
    User.find((err, users) => {
      if (err) throw err
      console.log(users)
    })
  })
})
