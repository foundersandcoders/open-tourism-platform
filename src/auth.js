const router = require('express').Router()
const path = require('path')
const mongoose = require('mongoose')

module.exports = router

const OAuthServer = require('express-oauth-server')

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

const UserTests = mongoose.model('UserTests', userSchema)

const tokenSchema = mongoose.Schema(
  {
    accessToken: String,
    accessTokenExpiresAt: Date,
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
)

const Token = mongoose.model('Token', tokenSchema)

const authorizationCodeSchema = mongoose.Schema(
  {
    code: String,
    scope: String,
    expiresAt: Date,
    redirectUri: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTests' }
  }

)

const AuthorizationCode = mongoose.model('AuthorizationCodeSchema', authorizationCodeSchema)

const clientSchema = mongoose.Schema(
  {
    id: String, // client_id
    clientSecret: String,
    grants: [ String ],
    redirectUris: [ String ]
  }
)

const Client = mongoose.model('Client', clientSchema)

const Model = {
  getAccessToken: accessToken =>
    Token.find({accessToken}).populate('user').exec(),
  getAuthorizationCode: authCode =>
    AuthorizationCode.find({code: authCode}).populate('user client').exec(),
  getClient: (clientId, clientSecret) => {
    if (clientSecret) Client.find({id: clientId, clientSecret})
    else Client.find({clientId})
  },
  getRefreshToken: refreshToken =>
    Token.find({refreshToken}).populate('user').exec(),
  revokeAuthorizationCode: authCode => {
    AuthorizationCode.findOneAndRemove({code: authCode.code})
      .then((doc) => !!doc)
  },
  revokeToken: token => {
    Token.findOneAndRemove({refreshToken: token.refreshToken})
      .then((doc) => !!doc)
  },
  saveAuthorizationCode: (code, client, user) => {
    let authCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client.id,
      user: user.id
    }
    return AuthorizationCode.save(authCode)
      .then(authorizationCode => {
        return {
          authorizationCode: authorizationCode.authorizationCode,
          expiresAt: authorizationCode.expiresAt,
          redirectUri: authorizationCode.redirectUri,
          scope: authorizationCode.scope,
          client: {id: authorizationCode.client},
          user: {id: authorizationCode.client}
        }
      })
  },
  saveToken: (token, client, user) => {
    let newToken = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      client: client.id,
      user: user.id
    }
    return Token.save(newToken)
      .then((savedToken) => {
        return {
          accessToken: savedToken.accessToken,
          accessTokenExpiresAt: savedToken.accessTokenExpiresAt,
          refreshToken: savedToken.refreshToken,
          refreshTokenExpiresAt: savedToken.refreshTokenExpiresAt,
          scope: savedToken.scope,
          client: {id: savedToken.client},
          user: {id: savedToken.user}
        }
      })
  }
}

const oauth = new OAuthServer({ model: Model })

router.get('/oauth/authorize', (req, res) => {
  // render an authorization form
  res.sendFile(path.join(__dirname, 'public', 'authorize.html'))
})

router.post('/oauth/authorize', oauth.authorize())
router.post('/oauth/token', oauth.token())

router.use('/secure', oauth.authenticate())

router.get('/secure/secrets', (req, res) => {
  res.send('SECRETS')
})
