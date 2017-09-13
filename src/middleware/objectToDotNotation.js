const flattenObject = (oldObject) => {
  const setObject = {}
  Object.keys(oldObject).forEach((key) => {
    if (typeof oldObject[key] === 'object') {
      Object.keys(oldObject[key]).forEach((subkey) => {
        setObject[`${key}.${subkey}`] = oldObject[key][subkey]
      })
    } else {
      setObject[key] = oldObject[key]
    }
  })
  return setObject
}

module.exports = (req, res, next) => {
  if (typeof req.body === 'object') {
    req.body = flattenObject(req.body)
    return next()
  }
  return next()
}

module.exports.flattenObject = flattenObject
