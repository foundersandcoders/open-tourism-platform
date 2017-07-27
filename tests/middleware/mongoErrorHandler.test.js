const mongoErrorHandler = require('../../src/middleware/mongoErrorHandler.js')
const { messages: errMessages, names: errNames, codes: errCodes } = require('../../src/constants/errors.json')
const { spyGeneratorErrorMiddlewareCaller } = require('../helpers/index.js')

const tape = require('tape')

tape('mongoErrorHandler with non mongo error', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(mongoErrorHandler)

  const notMongoError = new Error('Not a mongo error')
  notMongoError.name = 'Not Mongo'

  const { nextSpy } = generateSpiesAndCallMiddleware(notMongoError)

  t.ok(nextSpy.called, `next was called`)
  t.equal(nextSpy.args[0][0], notMongoError, `next was called with the error`)
  t.end()
})

tape('mongoErrorHandler with MONGO_DUPLICATE_KEY', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(mongoErrorHandler)

  const badRequestError = new Error(errMessages.DUPLICATE_KEY)
  badRequestError.name = errNames.MONGO
  badRequestError.code = errCodes.MONGO_DUPLICATE_KEY

  const { resSpy } = generateSpiesAndCallMiddleware(badRequestError)

  t.ok(resSpy.boom.badRequest.called, `badRequest method was called`)
  t.equal(resSpy.boom.badRequest.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('mongoErrorHandler with UNHANDLED', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(mongoErrorHandler)

  const badImplementationError = new Error(errMessages.UNHANDLED_MONGO)
  badImplementationError.name = errNames.MONGO

  const { resSpy } = generateSpiesAndCallMiddleware(badImplementationError)

  t.ok(resSpy.boom.badImplementation.called, `badImplementation method was called`)
  t.equal(resSpy.boom.badImplementation.args[0][0], badImplementationError.message, `badImplementation was called with the error message`)
  t.end()
})
