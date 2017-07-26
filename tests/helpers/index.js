const sinon = require('sinon')

const helpers = module.exports = {}

helpers.dropCollectionAndEnd = (myCollection, assert) => {
  myCollection.remove({})
    .then(() => assert.end())
    .catch(err => assert.end(err))
}

// Generate the tests and messages for checking a function has been called and with the correct argument
const buildSpyTest = (assert, comparator, functionToCheck, spy) => {
  assert.ok(spy.called, `${functionToCheck} was called`)
  assert.equal(spy.args[0][0], comparator, `${functionToCheck} was called with the correct error message`)
  assert.end()
}

// build a res.boom object with a method we give it (i.e. the method we are checking is getting called)
const buildResponseObj = method => {
  const res = {boom: {}}
  res.boom[method] = function () {}
  return res
}

// make the arguments for testing whether a res.boom method is getting called, call the function we're testing
// then generate the tests
helpers.buildBoomSpyTest = (assert, functionToTest, errorMessage, boomFunction, errorName, errorCode) => {
  const testError = new Error(errorMessage)
  testError.name = errorName
  testError.code = errorCode
  const req = {}
  const res = buildResponseObj(boomFunction)
  const resSpy = sinon.spy(res.boom, boomFunction)

  // call the function we're testing
  functionToTest(testError, req, res)

  // build tests
  buildSpyTest(assert, errorMessage, boomFunction, resSpy)
}

helpers.buildNextSpyTest = (assert, functionToTest, errorMessage, errorName) => {
  const testError = new Error(errorMessage)
  testError.name = errorName
  const req = {}
  const res = {}
  const nextSpy = sinon.spy()

  // call the function we're testing
  functionToTest(testError, req, res, nextSpy)

  // build tests
  buildSpyTest(assert, testError, 'next', nextSpy)
}
