const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server.js')
const Product = require('../../src/models/Product.js')
const User = require('../../src/models/User.js')
const Token = require('../../src/models/auth/Token.js')

const { auth: authErrMessages } = require('../../src/constants/errors')

const { validProduct1, validProduct2, validProduct3, invalidProduct1 } = require('../fixtures/products.json')
const { validAdminUser, user, superUser } = require('../fixtures/users.json')
const { token } = require('../fixtures/auth/tokens.json')

const { dropCollectionAndEnd, dropCollectionsAndEnd } = require('../helpers/index.js')

const { makeLoggedInToken } = require('../../src/controllers/session.js')

// Tests for: GET /products
tape('GET /products when nothing in database', t => {
  supertest(server)
    .get('/api/v1/products')
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
        .get('/api/v1/products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) t.fail(err)
          t.equal(res.body.length, 2, 'response body should be an array with length 2')
          t.ok(res.body.map(product => product.en.name).includes(validProduct1.en.name), 'first product has been added')
          t.ok(res.body.map(product => product.en.name).includes(validProduct2.en.name), 'second product has been added')
        })
      supertest(server)
        .get('/api/v1/products?categories=pottery')
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
    .get('/api/v1/products/10')
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
        .get(`/api/v1/products/${result.id}`)
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
    .post('/api/v1/products')
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
    .post('/api/v1/products')
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
tape('PUT /products/:id unauthorized as not logged in', t => {
  return supertest(server)
    .put('/api/v1/products/507f1f77bcf86cd799439011')
    .send(validProduct1)
    .expect(401)
    .expect('Content-Type', /json/)
  .then(res => {
    t.equal(
      res.body.message,
      authErrMessages.UNAUTHORIZED,
      'should return unauthorized error message')
    t.end()
  })
   .catch(err => t.end(err))
})

tape('PUT /products/:id with id of something not in the database, logged in via Oauth as SUPER', t => {
  Promise.all([
    User.create(superUser),
    Token.create(token)
  ])
  .then(([user, authToken]) => {
    return supertest(server)
      .put('/api/v1/products/507f1f77bcf86cd799439011')
      .set('Authorization', 'Bearer ' + authToken.accessToken)
      .send(validProduct1)
      .expect(404)
      .expect('Content-Type', /json/)
  .then(res => {
    t.equal(res.body.message, 'No document matching that id', 'Correct message is sent back')
    dropCollectionsAndEnd([Product, User, Token], t)
  })
  .catch(err => t.end(err))
  })
})

tape('PUT /products/:id with valid id and valid new product data as Oauth Super', t => {
  Promise.all([
    Product.create(validProduct1),
    User.create(superUser),
    Token.create(token)
  ])
  .then(([product, user, authToken]) => {
    return supertest(server)
      .put(`/api/v1/products/${product._id}`)
      .set('Authorization', 'Bearer ' + authToken.accessToken)
      .send(validProduct2)
      .expect(200)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.en.name, validProduct2.en.name, 'Product should be correctly updated, and the updated product returned')
    // Now check whether it is updated in the database
    return Product.findById(res.body._id)
  })
  .then(product => {
    t.equal(product.en.name, validProduct2.en.name, 'Product is updated in the database')
    dropCollectionsAndEnd([Product, User, Token], t)
  })
  .catch(err => t.end(err))
})

tape('PUT /products/:id with valid id and valid new product data as logged in admin', t => {
  Promise.all([
    Product.create(validProduct1),
    User.create(validAdminUser),
    makeLoggedInToken(validAdminUser)
  ])
  .then(([product, user, token]) => {
    return supertest(server)
      .put(`/api/v1/products/${product._id}`)
      .set('Cookie', `token=${token}`)
      .send(validProduct2)
      .expect(200)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(res.body.en.name, validProduct2.en.name, 'Product should be correctly updated, and the updated product returned')
    // Now check whether it is updated in the database
    return Product.findById(res.body._id)
  })
  .then(product => {
    t.equal(product.en.name, validProduct2.en.name, 'Product is updated in the database')
    dropCollectionsAndEnd([Product, User, Token], t)
  })
  .catch(err => t.end(err))
})

tape('PUT /products/:id with valid id and valid new product data as unauthorized Oauth Basic', t => {
  Promise.all([
    Product.create(validProduct1),
    User.create(user),
    Token.create(token)
  ])
  .then(([product, user, authToken]) => {
    return supertest(server)
      .put(`/api/v1/products/${product._id}`)
      .set('Authorization', 'Bearer ' + authToken.accessToken)
      .send(validProduct2)
      .expect(401)
      .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(
      res.body.message,
      authErrMessages.UNAUTHORIZED,
      'should return unauthorized error message')
    dropCollectionsAndEnd([Product, User, Token], t)
  })
  .catch(err => t.end(err))
})

// Tests for: DELETE /products/:id
tape('DELETE /products/:id with id of something not in the database', t => {
  Promise.all([
    Product.create(validProduct1),
    User.create(superUser),
    makeLoggedInToken(user)
  ])
  .then(([product, userSuper, token]) => {
    return supertest(server)
    .delete('/api/v1/products/507f1f77bcf86cd799439011')
    .set('Cookie', `token=${token}`)
    .expect(404)
    .expect('Content-Type', /json/)
  })
  .then(res => {
    t.ok(res.body.message, 'Message sent back')
    t.equal(res.body.message, 'No document matching that id', 'Correct message is sent back')
    dropCollectionsAndEnd([Product, User], t)
  })
  .catch(err => t.end(err))
})

tape('DELETE /products/:id with good ID', t => {
  Promise.all([
    Product.create(validProduct1),
    Product.create(validProduct2),
    User.create(superUser),
    makeLoggedInToken(superUser)
  ])
  .then(([product, productToBeDeleted, userSuper, token]) => {
    supertest(server)
    .delete(`/api/v1/products/${productToBeDeleted.id}`)
    .set('Cookie', `token=${token}`)
    .expect(204)
    .then(res => {
      t.deepEqual(res.body, {}, 'Nothing returned after deletion')
      // check our database now has one fewer product
      Product.find()
      .then(productsAfterDeletion => {
        t.equal(productsAfterDeletion.length, 1, 'Products should now be length 1')
        t.ok(productsAfterDeletion[0].id !== productToBeDeleted.id, 'deleted product should no longer be in the database')
        dropCollectionsAndEnd([Product, User], t)
      })
      .catch(err => {
        t.fail(err)
        dropCollectionsAndEnd([Product, User], t)
      })
    })
    .catch(err => t.end(err))
  })
  .catch(err => t.end(err))
})

tape('DELETE /products/:id with good ID as non super owner of resource', t => {
  Promise.all([
    Product.create(validProduct1),
    Product.create(validProduct3),
    User.create(user),
    makeLoggedInToken(user)
  ])
  .then(([product, productToBeDeleted, userSuper, token]) => {
    return supertest(server)
    .delete(`/api/v1/products/${productToBeDeleted.id}`)
    .set('Cookie', `token=${token}`)
    .expect(204)
  })
  .then(res => {
    t.deepEqual(res.body, {}, 'Nothing returned after deletion')
    // check our database now has one fewer product
    return Product.find()
  })
  .then(productsAfterDeletion => {
    t.equal(productsAfterDeletion.length, 1, 'Products should now be length 1')
    t.ok(productsAfterDeletion[0].id !== validProduct3.id, 'deleted product should no longer be in the database')
    dropCollectionsAndEnd([Product, User], t)
  })
  .catch(err => t.end(err))
})

tape('DELETE /products/:id with good ID as non super non owner of resource', t => {
  Promise.all([
    Product.create(validProduct1),
    Product.create(validProduct2),
    User.create(user),
    makeLoggedInToken(user)
  ])
  .then(([productToBeDeleted, product, userSuper, token]) => {
    return supertest(server)
    .delete(`/api/v1/products/${productToBeDeleted.id}`)
    .set('Cookie', `token=${token}`)
    .expect(401)
    .expect('Content-Type', /json/)
  })
  .then(res => {
    t.equal(
      res.body.message,
      authErrMessages.UNAUTHORIZED,
      'should return unauthorized error message')
    dropCollectionsAndEnd([Product, User], t)
  })
  .catch(err => t.end(err))
})
