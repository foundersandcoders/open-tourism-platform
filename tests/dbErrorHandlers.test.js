const dbErrorHandlers = require('../src/dbErrorHandlers.js')
const { messages: errMessages, names: errNames, codes: errCodes } = require('../src/constants/errors.json')
const { buildNextSpyTest, buildBoomSpyTest } = require('./helpers/index.js')

const tape = require('tape')

tape('dbErrorHandlers.custom with non custom error', t => {
  buildNextSpyTest(t, dbErrorHandlers.custom, 'test error message', 'not a custom error')
})

tape('dbErrorHandlers.custom with GET_ID_NOT_FOUND', t => {
  buildBoomSpyTest(t, dbErrorHandlers.custom, errMessages.GET_ID_NOT_FOUND, 'notFound', errNames.CUSTOM)
})

tape('dbErrorHandlers.custom with UPDATE_ID_NOT_FOUND', t => {
  buildBoomSpyTest(t, dbErrorHandlers.custom, errMessages.UPDATE_ID_NOT_FOUND, 'badRequest', errNames.CUSTOM)
})

tape('dbErrorHandlers.custom with DELETE_ID_NOT_FOUND', t => {
  buildBoomSpyTest(t, dbErrorHandlers.custom, errMessages.DELETE_ID_NOT_FOUND, 'badRequest', errNames.CUSTOM)
})

tape('dbErrorHandlers.custom with UNHANDLED', t => {
  buildBoomSpyTest(t, dbErrorHandlers.custom, errMessages.UNHANDLED_CUSTOM, 'badImplementation', errNames.CUSTOM)
})

tape('dbErrorHandlers.mongo with non mongo error', t => {
  buildNextSpyTest(t, dbErrorHandlers.mongo, 'test error message', 'not a mongo error')
})

tape('dbErrorHandlers.mongo with MONGO_DUPLICATE_KEY', t => {
  buildBoomSpyTest(t, dbErrorHandlers.mongo, errMessages.DUPLICATE_KEY, 'badRequest', errNames.MONGO, errCodes.MONGO_DUPLICATE_KEY)
})

tape('dbErrorHandlers.mongo with UNHANDLED', t => {
  buildBoomSpyTest(t, dbErrorHandlers.mongo, errMessages.UNHANDLED_MONGO, 'badImplementation', errNames.MONGO)
})

tape('dbErrorHandlers.mongoose with MONGOOSE_VALIDATION', t => {
  buildBoomSpyTest(t, dbErrorHandlers.mongoose, errMessages.VALIDATION_FAILED, 'badRequest', errNames.MONGOOSE_VALIDATION)
})

tape('dbErrorHandlers.mongoose with MONGOOSE_CAST', t => {
  buildBoomSpyTest(t, dbErrorHandlers.mongoose, errMessages.INVALID_ID, 'badRequest', errNames.MONGOOSE_CAST)
})

tape('dbErrorHandlers.mongoose with UNHANDLED', t => {
  buildBoomSpyTest(t, dbErrorHandlers.mongoose, errMessages.UNHANDLED_MONGOOSE, 'badImplementation', 'not a mongoose error')
})
