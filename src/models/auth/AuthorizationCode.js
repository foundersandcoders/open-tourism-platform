const mongoose = require('mongoose')

const authorizationCodeSchema = mongoose.Schema(
  {
    authorizationCode: String,
    scope: String,
    expiresAt: Date,
    redirectUri: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
)

module.exports = mongoose.model('AuthorizationCodeSchema', authorizationCodeSchema)
