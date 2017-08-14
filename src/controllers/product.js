const Product = require('../models/Product')
const { rejectIfNull } = require('../db/utils')
const { messages: errMessages } = require('../constants/errors')

const productController = module.exports = {}

productController.getAll = (req, res, next) => {
  // sends back array of products, filtered by queries
  Product.find(req.query)
    .then(products => res.status(200).send(products))
    .catch(next)
}

productController.getById = (req, res, next) => {
  // receives id in url
  // sends back one product or errors
  const id = req.params.id
  Product.findById(id)
    .then(rejectIfNull(errMessages.GET_ID_NOT_FOUND))
    .then(product => res.status(200).send(product))
    .catch(next)
}

productController.create = (req, res, next) => {
  // receives json for product in body
  // sends back created product
  const newProduct = new Product(req.body)
  newProduct.save()
    .then(product => res.status(201).send(product))
    .catch(next)
}

productController.update = (req, res, next) => {
  // receives id in url
  // receives updated json for product in body
  // updates or errors
  const id = req.params.id
  Product.findByIdAndUpdate(id, req.body, { new: true })
    .then(rejectIfNull(errMessages.UPDATE_ID_NOT_FOUND))
    .then(updatedProduct => res.status(200).send(updatedProduct))
    .catch(next)
}

productController.delete = (req, res, next) => {
  // receives id in url
  // deletes or errors
  const id = req.params.id
  Product.findByIdAndRemove(id)
    .then(rejectIfNull(errMessages.DELETE_ID_NOT_FOUND))
    .then(() => res.status(204).send())
    .catch(next)
}
