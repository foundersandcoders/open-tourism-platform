const customErrorHandler = require('../../src/middleware/customErrorHandler.js')
const { messages: errMessages, names: errNames } = require('../../src/constants/errors.json')
const { spyGeneratorErrorMiddlewareCaller } = require('../helpers/index.js')

const tape = require('tape')

tape('customErrorHandler with non custom error', t => {
  // make function to call the middle and generate spies we need
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(customErrorHandler)
  // make error to test with
  const notCustomError = new Error('Not a custom error')
  notCustomError.name = 'Not Custom'
  // extract the spy
  const { nextSpy } = generateSpiesAndCallMiddleware(notCustomError)
  // carry out the tests
  t.ok(nextSpy.called, `next was called`)
  t.equal(nextSpy.args[0][0], notCustomError, `next was called with the error`)
  t.end()
})

tape('customErrorHandler with GET_ID_NOT_FOUND', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(customErrorHandler)

  const notFoundError = new Error(errMessages.GET_ID_NOT_FOUND)
  notFoundError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleware(notFoundError)

  t.ok(resSpy.boom.notFound.called, `notFound method was called`)
  t.equal(resSpy.boom.notFound.args[0][0], notFoundError.message, `notFound was called with the error message`)
  t.end()
})

tape('customErrorHandler with UPDATE_ID_NOT_FOUND', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(customErrorHandler)

  const badRequestError = new Error(errMessages.UPDATE_ID_NOT_FOUND)
  badRequestError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleware(badRequestError)

  t.ok(resSpy.boom.badRequest.called, `badRequest method was called`)
  t.equal(resSpy.boom.badRequest.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('customErrorHandler with DELETE_ID_NOT_FOUND', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(customErrorHandler)

  const badRequestError = new Error(errMessages.DELETE_ID_NOT_FOUND)
  badRequestError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleware(badRequestError)

  t.ok(resSpy.boom.badRequest.called, `badRequest method was called`)
  t.equal(resSpy.boom.badRequest.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('customErrorHandler with UNHANDLED', t => {
  const generateSpiesAndCallMiddleware = spyGeneratorErrorMiddlewareCaller(customErrorHandler)

  const badImplementationError = new Error(errMessages.UNHANDLED_CUSTOM)
  badImplementationError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleware(badImplementationError)

  t.ok(resSpy.boom.badImplementation.called, `badImplementation method was called`)
  t.equal(resSpy.boom.badImplementation.args[0][0], badImplementationError.message, `badImplementation was called with the error message`)
  t.end()
})
