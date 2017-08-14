const { messages: errMessages, names: errNames } = require('../constants/errors')

const createCustomDbError = message => {
  const err = new Error(message)
  err.name = errNames.CUSTOM
  return err
}

const rejectIfNull = message => res =>
  res === null
    ? Promise.reject(createCustomDbError(message))
    : res

const customRequireValidator = function (next) {
  if (!this.en && !this.ar) {
    this.invalidate('(en, ar)', 'one of Path `en` or Path `ar` required')
  }
  next()
}

module.exports = {
  customRequireValidator,
  rejectIfNull
}
