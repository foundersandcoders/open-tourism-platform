if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  require('dotenv').config()
  if (process.env.NODE_ENV === 'test') {
    // set environment variables for test environment
    process.env.MONGODB_URI = process.env.MONGODB_URI_TEST
  } else if (process.env.NODE_ENV === 'development') {
    // set environment variables for dev environment
    process.env.MONGODB_URI = process.env.MONGODB_URI_DEV
  }
}

console.log(process.env.MONGODB_URI)
