const dbErrorHandlers = require('../src/dbErrorHandlers.js')
const { messages: errMessages, names: errNames, codes: errCodes } = require('../src/constants/errors.json')
const { spyGeneratorErrorMiddlewareCaller } = require('./helpers/index.js')

const tape = require('tape')

tape('dbErrorHandlers.custom with non custom error', t => {
  // make function to call the middle and generate spies we need
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.custom)
  // make error to test with
  const notCustomError = new Error('Not a custom error')
  notCustomError.name = 'Not Custom'
  // extract the spy
  const { nextSpy } = generateSpiesAndCallMiddleWare(notCustomError, 'anon')
  // carry out the tests
  t.ok(nextSpy.called, `next was called`)
  t.equal(nextSpy.args[0][0], notCustomError, `next was called with the error`)
  t.end()
})

tape('dbErrorHandlers.custom with GET_ID_NOT_FOUND', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.custom)

  const notFoundError = new Error(errMessages.GET_ID_NOT_FOUND)
  notFoundError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleWare(notFoundError, 'notFound')

  t.ok(resSpy.called, `notFound method was called`)
  t.equal(resSpy.args[0][0], notFoundError.message, `notFound was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.custom with UPDATE_ID_NOT_FOUND', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.custom)

  const badRequestError = new Error(errMessages.UPDATE_ID_NOT_FOUND)
  badRequestError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleWare(badRequestError, 'badRequest')

  t.ok(resSpy.called, `badRequest method was called`)
  t.equal(resSpy.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.custom with DELETE_ID_NOT_FOUND', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.custom)

  const badRequestError = new Error(errMessages.DELETE_ID_NOT_FOUND)
  badRequestError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleWare(badRequestError, 'badRequest')

  t.ok(resSpy.called, `badRequest method was called`)
  t.equal(resSpy.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.custom with UNHANDLED', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.custom)

  const badImplementationError = new Error(errMessages.UNHANDLED_CUSTOM)
  badImplementationError.name = errNames.CUSTOM

  const { resSpy } = generateSpiesAndCallMiddleWare(badImplementationError, 'badImplementation')

  t.ok(resSpy.called, `badImplementation method was called`)
  t.equal(resSpy.args[0][0], badImplementationError.message, `badImplementation was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.mongo with non mongo error', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.mongo)

  const notMongoError = new Error('Not a mongo error')
  notMongoError.name = 'Not Mongo'

  const { nextSpy } = generateSpiesAndCallMiddleWare(notMongoError, 'anon')

  t.ok(nextSpy.called, `next was called`)
  t.equal(nextSpy.args[0][0], notMongoError, `next was called with the error`)
  t.end()
})

tape('dbErrorHandlers.mongo with MONGO_DUPLICATE_KEY', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.mongo)

  const badRequestError = new Error(errMessages.DUPLICATE_KEY)
  badRequestError.name = errNames.MONGO
  badRequestError.code = errCodes.MONGO_DUPLICATE_KEY

  const { resSpy } = generateSpiesAndCallMiddleWare(badRequestError, 'badRequest')

  t.ok(resSpy.called, `badRequest method was called`)
  t.equal(resSpy.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.mongo with UNHANDLED', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.mongo)

  const badImplementationError = new Error(errMessages.UNHANDLED_MONGO)
  badImplementationError.name = errNames.MONGO

  const { resSpy } = generateSpiesAndCallMiddleWare(badImplementationError, 'badImplementation')

  t.ok(resSpy.called, `badImplementation method was called`)
  t.equal(resSpy.args[0][0], badImplementationError.message, `badImplementation was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.mongoose with MONGOOSE_VALIDATION', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.mongoose)

  const badRequestError = new Error(errMessages.VALIDATION_FAILED)
  badRequestError.name = errNames.MONGOOSE_VALIDATION

  const { resSpy } = generateSpiesAndCallMiddleWare(badRequestError, 'badRequest')

  t.ok(resSpy.called, `badRequest method was called`)
  t.equal(resSpy.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.mongoose with MONGOOSE_CAST', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.mongoose)

  const badRequestError = new Error(errMessages.INVALID_ID)
  badRequestError.name = errNames.MONGOOSE_CAST

  const { resSpy } = generateSpiesAndCallMiddleWare(badRequestError, 'badRequest')

  t.ok(resSpy.called, `badRequest method was called`)
  t.equal(resSpy.args[0][0], badRequestError.message, `badRequest was called with the error message`)
  t.end()
})

tape('dbErrorHandlers.mongoose with UNHANDLED', t => {
  const generateSpiesAndCallMiddleWare = spyGeneratorErrorMiddlewareCaller(dbErrorHandlers.mongoose)

  const badImplementationError = new Error(errMessages.UNHANDLED_MONGOOSE)
  badImplementationError.name = 'UNHANDLED MONGOOSE'

  const { resSpy } = generateSpiesAndCallMiddleWare(badImplementationError, 'badImplementation')

  t.ok(resSpy.called, `badImplementation method was called`)
  t.equal(resSpy.args[0][0], badImplementationError.message, `badImplementation was called with the error message`)
  t.end()
})
