if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  require('dotenv').config()
  if (process.env.NODE_ENV === 'test') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_TEST
  } else if (process.env.NODE_ENV === 'development') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_DEV
  }
}
