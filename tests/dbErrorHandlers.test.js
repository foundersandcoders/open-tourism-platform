const sinon = require('sinon')
const dbErrorHandlers = require('../src/dbErrorHandlers.js')
const { createCustomDbError } = require('../src/db/utils.js')
const { messages: errMessages, names: errNames } = require('../src/constants/errors.json')

const tape = require('tape')

// Generate the tests and messages for checking a function has been called and with the correct argument
const buildSpyTest = (t, errMessage, testFunction, spy) => {
  t.ok(spy.called, `${testFunction} was called`)
  t.equal(spy.args[0][0], errMessage, `${testFunction} was called with the correct error message`)
  t.end()
}

// build a res.boom object with a method we give it (i.e. the method we are checking is getting called)
const buildResObj = method => {
  const res = {boom: {}}
  res.boom[method] = function () {}
  return res
}

// make the arguments for testing whether a res.boom method is getting called, then generate the tests
const buildBoomSpyTest = (t, errMessage, boomFunction) => {
  const testError = createCustomDbError(errMessage)
  const req = {}
  const res = buildResObj(boomFunction)
  const resSpy = sinon.spy(res.boom, boomFunction)

  // call the function we're testing
  dbErrorHandlers.custom(testError, req, res)

  buildSpyTest(t, errMessage, boomFunction, resSpy)
}

tape('dbErrorHandlers.custom with non custom error', t => {
  // construct arguments
  const testError = new Error('test error')
  testError.name = 'Not a custom Error'
  const nextSpy = sinon.spy()

  // call the function we're testing
  dbErrorHandlers.custom(testError, {}, {}, nextSpy)

  buildSpyTest(t, testError, 'next', nextSpy)
})

tape('dbErrorHandlers.custom with GET_ID_NOT_FOUND', t => {
  buildBoomSpyTest(t, errMessages.GET_ID_NOT_FOUND, 'notFound')
})

tape('dbErrorHandlers.custom with UPDATE_ID_NOT_FOUND', t => {
  buildBoomSpyTest(t, errMessages.UPDATE_ID_NOT_FOUND, 'badRequest')
})

tape('dbErrorHandlers.custom with DELETE_ID_NOT_FOUND', t => {
  buildBoomSpyTest(t, errMessages.DELETE_ID_NOT_FOUND, 'badRequest')
})

tape('dbErrorHandlers.custom with UNHANDLED', t => {
  buildBoomSpyTest(t, errMessages.UNHANDLED_CUSTOM, 'badImplementation')
})
