const Token = require('./models/auth/Token')
const Client = require('./models/auth/Client')
const AuthorizationCode = require('./models/auth/AuthorizationCode')

module.exports = {
  getAccessToken: accessToken =>
    Token.findOne({ accessToken })
      .populate('user client'),

  getAuthorizationCode: authCode =>
    AuthorizationCode.findOne({ authorizationCode: authCode })
      .populate('user client'),

  getClient: (clientId, clientSecret) => {
    const params = { _id: clientId }
    if (clientSecret) params.secret = clientSecret
    return Client.findOne(params)
  },

  getRefreshToken: refreshToken =>
    Token.findOne({ refreshToken })
      .populate('user client'),

  // should return true if successful
  revokeAuthorizationCode: authCode =>
    AuthorizationCode.findOneAndRemove({ authorizationCode: authCode.authorizationCode })
      .then(doc => !!doc),

  // should return true if successful
  revokeToken: token =>
    Token.findOneAndRemove({ refreshToken: token.refreshToken })
      .then(doc => !!doc),

  saveAuthorizationCode: (code, client, user) => {
    const authCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client.id,
      user: user.id
    }
    return AuthorizationCode.create(authCode)
      .then(authCode => ({
        authorizationCode: authCode.authorizationCode,
        expiresAt: authCode.expiresAt,
        redirectUri: authCode.redirectUri,
        scope: authCode.scope,
        client: {id: authCode.client},
        user: {id: authCode.user}
      }))
  },

  saveToken: (token, client, user) => {
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
      .then(savedToken => ({
        accessToken: savedToken.accessToken,
        accessTokenExpiresAt: savedToken.accessTokenExpiresAt,
        refreshToken: savedToken.refreshToken,
        refreshTokenExpiresAt: savedToken.refreshTokenExpiresAt,
        scope: savedToken.scope,
        client: {id: savedToken.client},
        user: {id: savedToken.user}
      }))
  }
}
