const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Place = require('../../src/models/Place.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validPlace1, validPlace2, invalidPlace1 } = require('../fixtures/places.json')

// Tests for: GET /places

// Tests for: GET /places/:id

// Tests for: POST /places

// Tests for: PUT /places/:id

// Tests for: DELETE /places/:id
