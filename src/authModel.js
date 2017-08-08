const Token = require('./models/auth/Token')
const Client = require('./models/auth/Client')
const AuthorizationCode = require('./models/auth/AuthorizationCode')

module.exports = {
  getAccessToken: accessToken => {
    console.log('finding token, accessToken = ' + accessToken)
    return Token.findOne({ accessToken })
      .populate('user')
      .exec()
  },

  getAuthorizationCode: authCode => {
    console.log('finding auth code, code = ' + authCode)
    return AuthorizationCode.findOne({ authorizationCode: authCode })
      .populate('user client')
      .then(code => {
        return code
      })
      .catch(err => err)
  },

  getClient: (clientId, clientSecret) => {
    console.log('finding client, id = ' + clientId + ', secret = ' + clientSecret)
    const params = { _id: clientId }
    if (clientSecret) params.secret = clientSecret
    return Client.findOne(params)
      .then(client => {
        return client
      })
      .catch(err => err)
      // .exec()
  },

  getRefreshToken: refreshToken =>
    Token.find({ refreshToken }).populate('user').exec(),

  revokeAuthorizationCode: authCode => {
    // should return true if successful
    console.log('revoking auth code: ')
    return AuthorizationCode.findOneAndRemove({ authorizationCode: authCode.authorizationCode })
      .then(doc => !!doc)
  },

  revokeToken: token => {
    Token.findOneAndRemove({refreshToken: token.refreshToken})
      .then((doc) => !!doc)
  },

  saveAuthorizationCode: (code, client, user) => {
    console.log('saving authorization code.')
    const authCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client._id,
      user: user._id
    }
    console.log('code: ', code.authorizationCode)
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
    console.log('saving token')
    const newToken = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      client: client.id,
      user: user.id
    }
    return Token.create(newToken)
      .then(savedToken => {
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
