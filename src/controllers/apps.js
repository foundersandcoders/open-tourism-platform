const appsController = module.exports = {}

appsController.get = (req, res, next) => {
  // Only if authorised
  res.send('Here are you apps')
}
