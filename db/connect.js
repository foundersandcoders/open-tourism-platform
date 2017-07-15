const mongoose = require('mongoose')

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise

const dbURI = process.env.MONGODB_URI

mongoose.connect(dbURI, {
  useMongoClient: true
})

mongoose.connection.on('error', err => {
  console.log('connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected.')
})

module.exports = mongoose.connection
