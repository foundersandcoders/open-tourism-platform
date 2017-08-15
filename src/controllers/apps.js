const appsController = module.exports = {}

appsController.get = (req, res, next) => {
  // Only if authorised
  res.send('IN!')
}
