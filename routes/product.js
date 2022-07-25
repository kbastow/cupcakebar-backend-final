const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Product = require('./../models/Product')
const path = require('path')



// GET - get all products ---------------------------

router.get('/', Utils.authenticateToken, (req, res) => {
  Product.find()
    .then(products => {
      if(products == null){
        return res.status(404).json({
          message: "No products found"
        })
      }
      res.json(products)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting products"
      })
    })  
})


// GET - get single product by id -------------------------------------------------------

router.get('/:id', Utils.authenticateToken, (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      if(product == null){
        return res.status(404).json({
          message: "No product found"
        })
      }
      res.json(product)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Couldn't get product",
        error: err
      })
    })
})


// POST - create new product --------------------------------------

router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "Product content can't be empty"})
  }
  // validate - check if image file exist
  if(!req.files || !req.files.image){
    return res.status(400).send({message: "Please include an image"})
  }

  console.log('req.body = ', req.body)

  // image file must exist, upload, then create new product
  let uploadPath = path.join(__dirname, '..', 'public', 'images')
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
    // create new product
    let newProduct = new Product({
      productName: req.body.productName,
      image: uniqueFilename,
      description: req.body.description,
      ingredients: req.body.ingredients,
      price: req.body.price,
      glutenFree: req.body.glutenFree,
      nutFree: req.body.nutFree,
      dairyFree: req.body.dairyFree,
      vegan: req.body.vegan,
    })
  
    newProduct.save()
    .then(product => {        
      // success!  
      // return 201 status with object
      return res.status(201).json(product)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating product listing",
        error: err
      })
    })
  })
})


// PUT - update product ---------------------------------------------

router.put('/', (req, res) => {
  // validate request
  if(!req.body) return res.status(400).send("Product content can't be empty")
  
  // update Product
  updateProduct(req.body)
  function updateProduct(update){    
    Product.findByIdAndUpdate(req.params.id, update)
    .then(product => res.json(product))
    .catch(err => {
      res.status(500).json({
        message: 'Problem updating product',
        error: err
      })
    }) 
  }
})

// DELETE - Delete product ---------------------------------------------

router.delete("/:id", (req, res) => {
  // validate the request
  if(!req.params.id){
    return res.status(400).json({
      message: "product id is missing"
    })
  }
  // delete the product using to Product model
  Product.findOneAndDelete({_id: req.params.id})
  .then(() => {
    res.json({
      message: "Product deleted"
    })
  })
  .catch((err) => {
    console.log("error deleting product", err)
    res.status(500).json({
      message: "error deleting product",
      error: err
    })
  })
})

// export
module.exports = router