const { getToken } = require('../../src/middleware/authHelpers.js')

const tape = require('tape')

tape('test getToken function where req has auth header', t => {
  const req = {
    headers: {
      authorization: 'Bearer sometoken'
    }
  }
  t.equal(getToken(req), 'sometoken', 'token is returned')
  t.end()
})

tape('test getToken function where req has token query param', t => {
  const req = {
    headers: {},
    query: {
      token: 'sometoken'
    }
  }
  t.equal(getToken(req), 'sometoken', 'token is returned')
  t.end()
})

tape('test getToken function where req has token cookie', t => {
  const req = {
    headers: {},
    query: {},
    cookies: {
      token: 'sometoken'
    }
  }
  t.equal(getToken(req), 'sometoken', 'token is returned')
  t.end()
})
