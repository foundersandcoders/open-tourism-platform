const sinon = require('sinon')
const dbErrorHandlers = require('../src/dbErrorHandlers.js')
const { createCustomDbError } = require('../src/db/utils.js')
const { messages: errMessages, names: errNames } = require('../src/constants/errors.json')

const tape = require('tape')

tape('Test custom error handler with non custom error', t => {
  // construct arguments
  const testError = new Error('test error')
  testError.name = 'Not a custom Error'
  const req = {}
  const res = {}
  const nextSpy = sinon.spy()

  // call the function we're testing
  dbErrorHandlers.custom(testError, req, res, nextSpy)

  t.ok(nextSpy.called, 'next was called')
  t.equal(nextSpy.args[0][0], testError, 'next was called with the error')
  t.end()
})

tape('Test custom error handler with id not found error', t => {
  // construct arguments
  const testError = createCustomDbError(errMessages.GET_ID_NOT_FOUND)
  const req = {}
  const res = {boom: { notFound: function () {} }}
  const resSpy = sinon.spy(res.boom, 'notFound')

  // call the function we're testing
  dbErrorHandlers.custom(testError, req, res)

  t.ok(resSpy.called, 'res.boom.notFound was called')
  t.equal(resSpy.args[0][0], errMessages.GET_ID_NOT_FOUND, 'res.boom.notFound was called with the correct Error message')
  t.end()
})
