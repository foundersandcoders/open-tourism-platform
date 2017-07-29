const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Product = require('../../src/models/Product.js')
const { dropCollectionAndEnd } = require('../helpers/index.js')
const { validProduct1, validProduct2, invalidProduct1 } = require('../fixtures/products.json')

// Tests for: GET /products
tape('GET /products when nothing in database', t => {
  supertest(server)
    .get('/products')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.length, 0, 'should initially return empty array')
      dropCollectionAndEnd(Product, t)
    })
})

tape('GET /products, with and without query parameters', t => {
  Product.create(validProduct1, validProduct2)
    .then(() => {
      supertest(server)
        .get('/products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.length, 2, 'response body should be an array with length 2')
          t.ok(res.body.map(product => product.en.name).includes(validProduct1.en.name), 'first product has been added')
          t.ok(res.body.map(product => product.en.name).includes(validProduct2.en.name), 'second product has been added')
        })
      supertest(server)
        .get('/products?categories=handicraft')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.length, 1, 'filtered response body should be an array with length 1')
          t.equal(res.body[0].en.name, 'hand-made mug', 'results should be filtered correctly by url query parameters')
          dropCollectionAndEnd(Product, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: GET /products/:id
tape('GET /products/:id with invalid id', t => {
  supertest(server)
    .get('/products/10')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      // t.ok(res.body.message.includes('Database error'), 'response message should contain "Database error"')
      dropCollectionAndEnd(Product, t)
    })
})

tape('GET /products/:id with id of something in the database', t => {
  Product.create(validProduct1)
    .then(result => {
      supertest(server)
        .get(`/products/${result.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.en.name, validProduct1.en.name, 'should get product with correct name.')
          dropCollectionAndEnd(Product, t)
        })
    })
    .catch(err => t.end(err))
})

// Tests for: POST /products
tape('POST /products with valid product data', t => {
  supertest(server)
    .post('/products')
    .send(validProduct1)
    .expect(201)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.en.name, validProduct1.en.name, 'Correct object is added')
      t.ok(res.body._id && res.body.createdAt && res.body.updatedAt, 'id and timestamp fields added')
      // Now check whether it is in the database
      Product.findById(res.body._id)
        .then(product => {
          t.equal(product.en.name, res.body.en.name, 'Product is in the database')
          dropCollectionAndEnd(Product, t)
        })
        .catch(err => {
          t.fail(err)
          dropCollectionAndEnd(Product, t)
        })
    })
})

tape('POST /products with invalid product data', t => {
  supertest(server)
    .post('/products')
    .send(invalidProduct1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'A message is sent back')
      // t.ok(res.body.message.includes('Database error'), 'Correct message is sent back')
      dropCollectionAndEnd(Product, t)
    })
})

// Tests for: PUT /products/:id
tape('PUT /products/:id with id of something not in the database', t => {
  supertest(server)
    .put('/products/507f1f77bcf86cd799439011')
    .send(validProduct1)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.equal(res.body.message, 'Cannot find document to update', 'Correct message is sent back')
      dropCollectionAndEnd(Product, t)
    })
})

tape('PUT /products/:id with valid id and valid new product data', t => {
  Product.create(validProduct1)
    .then(createdProduct => {
      supertest(server)
        .put(`/products/${createdProduct.id}`)
        .send(validProduct2)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.en.name, validProduct2.en.name, 'Product should be correctly updated, and the updated product returned')
          // Now check whether it is updated in the database
          Product.findById(res.body._id)
            .then(product => {
              t.equal(product.en.name, validProduct2.en.name, 'Product is updated in the database')
              dropCollectionAndEnd(Product, t)
            })
            .catch(err => {
              t.fail(err)
              dropCollectionAndEnd(Product, t)
            })
        })
    })
    .catch(err => t.end(err))
})

// Tests for: DELETE /products/:id
tape('DELETE /products/:id with id of something not in the database', t => {
  supertest(server)
    .delete('/products/507f1f77bcf86cd799439011')
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) t.fail(err)
      t.ok(res.body.message, 'Message sent back')
      t.equal(res.body.message, 'Cannot find document to delete', 'Correct message is sent back')
      t.end()
    })
})

tape('DELETE /products/:id with good ID', t => {
  Product.create(validProduct1, validProduct2)
    .then(productToBeDeleted => {
      supertest(server)
        .delete(`/products/${productToBeDeleted.id}`)
        .expect(204)
        .end((err, res) => {
          if (err) t.fail(err)
          t.deepEqual(res.body, {}, 'Nothing returned after deletion')
          // check our database now has one fewer product
          Product.find()
            .then(productsAfterDeletion => {
              t.equal(productsAfterDeletion.length, 1, 'Products should now be length 1')
              t.ok(productsAfterDeletion[0].id !== productToBeDeleted.id, 'deleted product should no longer be in the database')
              dropCollectionAndEnd(Product, t)
            })
            .catch(err => {
              t.fail(err)
              dropCollectionAndEnd(Product, t)
            })
        })
    })
    .catch(err => t.end(err))
})
