const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Product = require('../../src/models/Product.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validProduct1, validProduct2, invalidProduct1 } = require('../fixtures/products.json')

// Tests for: GET /products

// Tests for: GET /products/:id

// Tests for: POST /products

// Tests for: PUT /products/:id

// Tests for: DELETE /products/:id
