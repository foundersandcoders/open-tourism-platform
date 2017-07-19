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

}

productController.create = (req, res) => {

}

productController.update = (req, res) => {

}

productController.delete = (req, res) => {

}
