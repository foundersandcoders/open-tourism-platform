const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Event = require('../../src/models/Event.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validEvent1, validEvent2, invalidEvent1 } = require('../fixtures/events.json')

// Tests for: GET /events

// Tests for: GET /events/:id

// Tests for: POST /events

// Tests for: PUT /events/:id

// Tests for: DELETE /events/:id
