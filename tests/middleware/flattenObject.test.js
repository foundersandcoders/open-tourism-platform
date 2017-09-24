const { flattenObject } = require('../../src/middleware/objectToDotNotation.js')

const tape = require('tape')

tape('Test flattenObject function', t => {
  const nestedObject = { key1: 1, key2: { key2a: 2, key2b: 3 } }
  const nonNestedObject = flattenObject(nestedObject)

  t.equal(Object.keys(nestedObject).length, 2, 'Original object is has two keys')
  t.equal(Object.keys(nonNestedObject).length, 3, 'New object is has three keys')
  t.end()
})
