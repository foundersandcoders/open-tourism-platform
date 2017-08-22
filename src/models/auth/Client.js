const mongoose = require('mongoose')

const clientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    secret: String,
    grants: [ String ],
    redirectUris: [ String ]
  }
)

module.exports = mongoose.model('Client', clientSchema)
