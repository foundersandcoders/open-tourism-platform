const sinon = require('sinon')

const helpers = module.exports = {}

helpers.dropCollectionAndEnd = (myCollection, t) => {
  myCollection.remove({})
    .then(() => {
      t.end()
    })
    .catch(err => t.end(err))
}

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
helpers.buildBoomSpyTest = (tester, functionToTest, errorMessage, boomFunction, errorName) => {
  const testError = new Error(errorMessage)
  testError.name = errorName
  const req = {}
  const res = buildResponseObj(boomFunction)
  const resSpy = sinon.spy(res.boom, boomFunction)

  // call the function we're testing
  functionToTest(testError, req, res)

  // build tests
  buildSpyTest(tester, errorMessage, boomFunction, resSpy)
}

helpers.buildNextSpyTest = (tester, functionToTest, errorMessage, errorName) => {
  const testError = new Error(errorMessage)
  testError.name = errorName
  const req = {}
  const res = {}
  const nextSpy = sinon.spy()

  // call the function we're testing
  functionToTest(testError, req, res, nextSpy)

  // build tests
  buildSpyTest(tester, testError, 'next', nextSpy)
}
