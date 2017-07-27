const sinon = require('sinon')

const helpers = module.exports = {}

helpers.dropCollectionAndEnd = (myCollection, assert) => {
  myCollection.remove({})
    .then(() => assert.end())
    .catch(err => assert.end(err))
}

// build a res.boom object with the functions that might get called as spies
const buildResponseObj = () => {
  const resSpy = {
    boom: {
      badRequest: sinon.spy(),
      notFound: sinon.spy(),
      badImplementation: sinon.spy()
    }
  }
  return resSpy
}

helpers.spyGeneratorErrorMiddlewareCaller = errorMiddleware => (error) => {
  const resSpy = buildResponseObj()
  const nextSpy = sinon.spy()
  errorMiddleware(error, undefined, resSpy, nextSpy)
  return { resSpy, nextSpy }
}
