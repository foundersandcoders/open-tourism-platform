const Product = require('../models/Product')

const productController = module.exports = {}

productController.getAll = (req, res) => {
  // sends back array of products, filtered by queries
  // status codes: 200 (success), 500 (db error)
  Product.find(req.query)
    .then(products => {
      res.send(products)
    })
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

productController.getById = (req, res) => {
  // receives id in url
  // sends back one product
  // status codes: 200 (success), 404 (not found)
  const id = req.params.id
  Product.findById(id)
    .then(product => res.send(product))
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(404).send(errorObj)
    })
}

productController.create = (req, res) => {
  // receives json for product in body
  // adds to db
  // status codes: 201 (created), 500 (server error)
  const newProduct = new Product(req.body)
  newProduct.save()
    .then(product => {
      res.status(201).send(product)
    })
    .catch(err => {
      // Sending back 500 error, may need changing when we think about how we validate
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

productController.update = (req, res) => {
  // receives id in url, updated json for product in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
  const id = req.params.id
  Product.findByIdAndUpdate(id, req.body, { new: true })
    .then(updatedProduct => res.send(updatedProduct))
    .catch(err => {
      const errorObj = { message: `Database error: ${err.message}` }
      res.status(400).send(errorObj)
    })
}

productController.delete = (req, res) => {

}
