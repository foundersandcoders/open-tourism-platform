const sinon = require('sinon')

const helpers = module.exports = {}

helpers.dropCollectionAndEnd = (myCollection, assert) => {
  myCollection.remove({})
    .then(() => assert.end())
    .catch(err => assert.end(err))
}

helpers.dropCollectionsAndEnd = (collections, assert) => {
  if (collections.length > 0) {
    return collections[0].remove({})
      .then(() => helpers.dropCollectionsAndEnd(collections.slice(1), assert))
      .catch(err => assert.end(err))
  }
  assert.end()
}

// build a res.boom object with the functions that might get called as spies
const buildResponseObj = () => {
  const resSpy = {
    boom: {
      badRequest: sinon.spy(),
      notFound: sinon.spy(),
      badImplementation: sinon.spy()
    },
    status: sinon.spy(),
    send: sinon.spy()
  }
  return resSpy
}

helpers.spyGeneratorErrorMiddlewareCaller = errorMiddleware => (error) => {
  const resSpy = buildResponseObj()
  const nextSpy = sinon.spy()
  errorMiddleware(error, undefined, resSpy, nextSpy)
  return { resSpy, nextSpy }
}
