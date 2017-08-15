const boomErrorHandler = require('../../src/middleware/boomErrorHandler.js')
const { spyGeneratorErrorMiddlewareCaller } = require('../helpers/index.js')
const { auth } = require('../../src/constants/errors.json')

const boom = require('boom')

const tape = require('tape')

tape('boomErrorHandler with non boom error', t => {
  // make function to call the middle and generate spies we need
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(boomErrorHandler)
  // make error to test with
  const notBoomError = new Error('Not a boom error')
  notBoomError.name = 'Not Boom'
  notBoomError.isBoom = false
  // extract the spy
  const { nextSpy } = generateSpiesAndCallMiddleware(notBoomError)
  // carry out the tests
  t.ok(nextSpy.called, `next was called`)
  t.equal(nextSpy.args[0][0], notBoomError, `next was called with the error`)
  t.end()
})

tape('boomErrorHandler with boom error', t => {
  // make function to call the middle and generate spies we need
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(boomErrorHandler)
  // make error to test with
  const boomError = boom.unauthorized(auth.UNAUTHORIZED)
  const { resSpy } = generateSpiesAndCallMiddleware(boomError)
  // carry out the tests
  t.ok(resSpy.status.called, `res.status was called`)
  t.equal(resSpy.status.args[0][0], boomError.output.statusCode, `.status was called with the error`)
  t.ok(resSpy.send.called, `res.send was called`)
  t.equal(resSpy.send.args[0][0], boomError.output.payload, `.send was called with the error`)
  t.end()
})
