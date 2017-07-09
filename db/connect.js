const mongoose = require('mongoose')

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise

const dbUrl = 'mongodb://localhost/testdb'

mongoose.connect(dbUrl, {
  useMongoClient: true
})

module.exports = mongoose.connection
