const mongoose = require('mongoose')

const clientSchema = mongoose.Schema(
  {
    id: String, // client_id
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTests' },
    clientSecret: String,
    grants: [ String ],
    redirectUris: [ String ]
  }
)

module.exports = mongoose.model('Client', clientSchema)
