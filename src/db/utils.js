const customRequireValidator = function (next) {
  if (!this.en && !this.ar) {
    this.invalidate('(en, ar)', 'one of Path `en` or Path `ar` required')
  }
  next()
}

module.exports = {
  customRequireValidator
}
