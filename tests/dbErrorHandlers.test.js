const sinon = require('sinon')
const dbErrorHandlers = require('../src/dbErrorHandlers.js')
const { messages: errMessages, names: errNames } = require('../src/constants/errors.json')

const tape = require('tape')

// Generate the tests and messages for checking a function has been called and with the correct argument
const buildSpyTest = (t, comparator, functionToCheck, spy) => {
  t.ok(spy.called, `${functionToCheck} was called`)
  t.equal(spy.args[0][0], comparator, `${functionToCheck} was called with the correct error message`)
  t.end()
}

// build a res.boom object with a method we give it (i.e. the method we are checking is getting called)
const buildResponseObj = method => {
  const res = {boom: {}}
  res.boom[method] = function () {}
  return res
}

// make the arguments for testing whether a res.boom method is getting called, call the function we're testing
// then generate the tests
const buildBoomSpyTest = (t, functionToTest, errorMessage, boomFunction, errorName) => {
  const testError = new Error(errorMessage)
  testError.name = errorName
  const req = {}
  const res = buildResponseObj(boomFunction)
  const resSpy = sinon.spy(res.boom, boomFunction)

  // call the function we're testing
  functionToTest(testError, req, res)

  buildSpyTest(t, errorMessage, boomFunction, resSpy)
}

const buildNextSpyTest = (t, functionToTest, errorMessage, errorName) => {
  const testError = new Error(errorMessage)
  testError.name = errorName
  const req = {}
  const res = {}
  const nextSpy = sinon.spy()

  // call the function we're testing
  functionToTest(testError, req, res, nextSpy)

  buildSpyTest(t, testError, 'next', nextSpy)
}

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

tape('dbErrorHandlers.mongo with UNHANDLED', t => {
  buildBoomSpyTest(t, dbErrorHandlers.mongo, errMessages.UNHANDLED_MONGO, 'badImplementation', errNames.MONGO)
})

// tape('dbErrorHandlers.mongo with UNHANDLED', t => {
//   buildBoomSpyTest(t, dbErrorHandlers.mongo, errMessages.UNHANDLED_MONGO, 'badImplementation')
// })
