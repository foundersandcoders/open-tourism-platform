if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  switch (process.env.NODE_ENV) {
    case 'test':
      process.env.MONGODB_URI = process.env.MONGODB_URI_TEST
      break
    case 'development':
      process.env.MONGODB_URI = process.env.MONGODB_URI_DEV
      break
  }
}
