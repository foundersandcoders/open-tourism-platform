const sinon = require('sinon')

const helpers = module.exports = {}

helpers.dropCollectionAndEnd = (myCollection, assert) => {
  myCollection.remove({})
    .then(() => assert.end())
    .catch(err => assert.end(err))
}

// build a res.boom object with a function we give it (i.e. the function we are checking is getting called)
const buildResponseObj = (functionToSpyOn) => {
  const res = {boom: {}}
  res.boom[functionToSpyOn] = function () {}
  const resSpy = sinon.spy(res.boom, functionToSpyOn)
  return { res, resSpy }
}

helpers.spyGeneratorErrorMiddlewareCaller = errorMiddleware => (error, functionToSpyOn) => {
  const { res, resSpy } = buildResponseObj(functionToSpyOn)
  const nextSpy = sinon.spy()
  errorMiddleware(error, undefined, res, nextSpy)
  return { resSpy, nextSpy }
}
