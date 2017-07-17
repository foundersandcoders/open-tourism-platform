const helpers = module.exports = {}

helpers.dropCollectionAndEnd = (myCollection, t) => {
  myCollection.collection.drop()
    .then(() => {
      t.end()
    })
    .catch(err => t.end(err))
}
