const router = require('express').Router()
const path = require('path')
const mongoose = require('mongoose')

module.exports = router

const OAuthServer = require('express-oauth-server')

const CLIENT_ID = '507f1f77bcf86cd799439011'
const USER_ID = '5986abad5e2d852cb1ee6bce'

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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTests' }
  }
)

const Token = mongoose.model('Token', tokenSchema)

const authorizationCodeSchema = mongoose.Schema(
  {
    authorizationCode: String,
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTests' },
    clientSecret: String,
    grants: [ String ],
    redirectUris: [ String ]
  }
)

const Client = mongoose.model('Client', clientSchema)

const Model = {
  getAccessToken: accessToken => {
    console.log('finding token, accessToken = ' + accessToken)
    return Token.findOne({ accessToken })
      .populate('user')
      .exec()
  },

  getAuthorizationCode: authCode => {
    console.log('finding auth code, code = ' + authCode)
    return AuthorizationCode.findOne({ code: authCode })
      .populate('user client')
      .exec()
  },

  getClient: (clientId, clientSecret) => {
    console.log('finding client, id = ' + clientId)
    return Client.findOne({ id: clientId, clientSecret })
      .exec()
  },

  getRefreshToken: refreshToken =>
    Token.find({ refreshToken }).populate('user').exec(),

  revokeAuthorizationCode: authCode => {
    AuthorizationCode.findOneAndRemove({code: authCode.code})
      .then((doc) => !!doc)
  },

  revokeToken: token => {
    Token.findOneAndRemove({refreshToken: token.refreshToken})
      .then((doc) => !!doc)
  },

  saveAuthorizationCode: (code, client, user) => {
    console.log('saving authorization code.')
    console.log('code: ')
    console.log(code)
    let authCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client.id,
      user: user.id
    }
    return AuthorizationCode.create(authCode)
      .then(authCode => {
        return {
          authorizationCode: authCode.authorizationCode,
          expiresAt: authCode.expiresAt,
          redirectUri: authCode.redirectUri,
          scope: authCode.scope,
          client: {id: authCode.client},
          user: {id: authCode.user}
        }
      })
      .catch(err => console.log(err))
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
    return Token.create(newToken)
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

// not strictly necessary
router.get('/oauth/clients/', (req, res) => {
  Client.find()
    .then(clients => res.send(clients))
    .catch(err => res.send(err))
})
router.get('/oauth/tokens/', (req, res) => {
  Token.find()
    .populate('user')
    .then(tokens => res.send(tokens))
    .catch(err => res.send(err))
})
router.get('/oauth/users/', (req, res) => {
  UserTests.find()
    .then(users => res.send(users))
    .catch(err => res.send(err))
})
router.get('/oauth/codes/', (req, res) => {
  AuthorizationCode.find()
    .then(codes => res.send(codes))
    .catch(err => res.send(err))
})

// create a new client (WIP)
router.post('/oauth/clients/', (req, res) => {
  // get grants and redirect URIs from request
  // generate id (client id)
  // generate client secret
  Client.save()
})

// // empty the db
// UserTests.remove({})
//   .then(() => console.log('removed users.'))
//   .catch(err => console.log('error removing users.'))
// Client.remove({})
//   .then(() => console.log('removed clients.'))
//   .catch(err => console.log('error removing clients.'))
// Token.remove({})
//   .then(() => console.log('removed tokens.'))
//   .catch(err => console.log('error removing tokens.'))

// create a user
router.get('/oauth/createUser', (req, res) => {
  UserTests.create({
    _id: USER_ID,
    id: USER_ID,
    username: 'username',
    password: 'password',
    email: 'test'
  })
  .then(user => res.send(user))
  .catch(err => res.send(err))
})

// create a client
router.get('/oauth/createClient', (req, res) => {
  Client.create({
    user: USER_ID,
    id: CLIENT_ID,
    secret: 'secret',
    grants: [ 'authorization_code' ],
    redirectUris: [ 'localhost:3000' ]
  })
  .then(client => res.send(client))
  .catch(err => res.send(err))
})

// create a token
router.get('/oauth/createToken', (req, res) => {
  Token.create({
    user: USER_ID,
    accessToken: 'token'
  })
  .then(token => res.send(token))
  .catch(err => res.send(err))
})

// authorize page for users
router.get('/oauth/authorize', (req, res) => {
  // render an authorization form
  res.sendFile(path.join(__dirname, 'public', 'authorize.html'))
})

router.get('/oauth/authorize.js', (req, res) => {
  // get query params to find out what the app is
  // display correct authorization grant prompt
  res.sendFile(path.join(__dirname, 'public', 'authorize.js'))
})

// post to grant authorization, to get back access code.
router.post('/oauth/authorize', oauth.authorize())

// request for an access token, needs access code
router.post('/oauth/token', oauth.token())

// secure routes
router.use('/secure', oauth.authenticate())

router.get('/secure/secrets', (req, res) => {
  res.send('SECRETS')
})
