const { verifyRole, addUserIdToSession } = require('./authHelpers.js')

module.exports = opts => (req, res, next) => {
  addUserIdToSession(req)
    .then(verifyRole(opts))
    .then(() => { next() })
    .catch(next)
}
