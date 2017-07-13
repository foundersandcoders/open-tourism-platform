const test = require('tape')

test('Check tape is working after db connection', t => {
  t.equal(1, 1, 'One is one')
  t.end()
})
