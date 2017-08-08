const { messages: errMessages } = require('../constants/errors')

module.exports = (err, req, res) => {
  console.error(err)
  res.boom.badImplementation(errMessages.UNHANDLED_CUSTOM)
}
