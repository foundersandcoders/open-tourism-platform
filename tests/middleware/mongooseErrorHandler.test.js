const mongooseErrorHandler = require('../../src/middleware/mongooseErrorHandler.js')
const { messages: errMessages, names: errNames } = require('../../src/constants/errors.json')
const { spyGeneratorErrorMiddlewareCaller } = require('../helpers/index.js')

const tape = require('tape')

tape('mongooseErrorHandler with MONGOOSE_VALIDATION', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(mongooseErrorHandler)

  const badRequestError = new Error(errMessages.VALIDATION_FAILED)
  badRequestError.name = errNames.MONGOOSE_VALIDATION

  const { resSpy } = generateSpiesAndCallMiddleware(badRequestError)

  t.ok(resSpy.boom.badRequest.called, `badRequest method was called`)
  t.equal(resSpy.boom.badRequest.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('mongooseErrorHandler with MONGOOSE_CAST', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(mongooseErrorHandler)

  const badRequestError = new Error(errMessages.INVALID_ID)
  badRequestError.name = errNames.MONGOOSE_CAST

  const { resSpy } = generateSpiesAndCallMiddleware(badRequestError)

  t.ok(resSpy.boom.badRequest.called, `badRequest method was called`)
  t.equal(resSpy.boom.badRequest.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('mongooseErrorHandler with UNHANDLED', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(mongooseErrorHandler)

  const badImplementationError = new Error(errMessages.UNHANDLED_MONGOOSE)
  badImplementationError.name = 'UNHANDLED MONGOOSE'

  const { resSpy } = generateSpiesAndCallMiddleware(badImplementationError)

  t.ok(resSpy.boom.badImplementation.called, `badImplementation method was called`)
  t.equal(resSpy.boom.badImplementation.args[0][0], badImplementationError.message, `badImplementation was called with the error message`)
  t.end()
})
