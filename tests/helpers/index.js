const helpers = module.exports = {}

helpers.dropCollectionAndEnd = (myCollection, t) => {
  myCollection.remove({})
    .then(() => {
      t.end()
    })
    .catch(err => t.end(err))
}
