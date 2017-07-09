const server = require('./server.js')

const port = process.env.PORT || 3000

server.listen(port, err => {
  if (err) {
    throw err
  }
  console.log(`Server listening on port ${port}`)
})