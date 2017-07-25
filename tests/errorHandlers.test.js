const sinon = require('sinon')
const { mongoError } = require('../src/errorHandler.js')
const tape = require('tape')

tape('Mongo Error', t => {
  // construct arguments
  const error = new Error('Mongo Error')
  error.name = 'MongoError'
  const req = {}
  const res = {boom: { badImplementation: function () {} }}
  const resSpy = sinon.spy(res.boom, 'badImplementation')

  // call the function we're testing
  mongoError(error, req, res)

  // check the spy was called correctly
  t.ok(resSpy.called, 'Boom.badImplementation called')
  t.equal(resSpy.args[0][0], 'An internal mongo server error occurred', 'Method called with correct Argument')
  t.end()
})

tape('Mongoose Error is passed to next by Mongo handler', t => {
  const error = new Error('Mongo Error')
  error.name = 'Not MongoError'
  const req = {}
  const res = {}
  const nextSpy = sinon.spy()

  mongoError(error, req, res, nextSpy)

  t.ok(nextSpy.called, 'next() called')
  t.equal(nextSpy.args[0][0], error, 'Next called with error')
  t.end()
})
