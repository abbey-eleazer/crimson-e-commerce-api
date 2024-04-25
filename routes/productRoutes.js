const express = require('express')
const {Product} = require('../models/productsModel')
const {Category} = require('../models/categoryModel')
const productsRouter = express.Router()
const mongoose  = require('mongoose')






// get all products 

productsRouter.get('/', async (req, res) => {

  // filtering products by category 

  let filter = {}
  if(req.query.categories) {
    filter = {category:req.query.categories.split(",") }
  }

  const productList = await Product.find(filter)

  if(!productList) {
    res.status(500).json({success: false})
  }
  res.send(productList) 
})


// get one product 

productsRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category')

  if(!product) {
    res.status(500).json({success: false})
  }
  res.send(product)
})



// creating a new product 

productsRouter.post('/',async (req, res) => {

  if(!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid product id')
  }
  //  validate category

  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('Invalid Category')
  

  //  create product

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    detailedDescription: req.body.detailedDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    images: req.body.images,
   
  })

  product = await product.save()

  if(!product) {
    return res.status(500).send('The product can not be created')
  }

  res.status(200).send(product)

})



// ***  update product 
productsRouter.put('/:id', async (req, res) => {

  //  validate category
  
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('Invalid Category')

  const product = await Product.findByIdAndUpdate(
   req.params.id,
   {
    name: req.body.name,
    description: req.body.description,
    detailedDescription: req.body.detailedDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    images: req.body.images,
   },
   {new: true}
 )
  
  if(!product) {
    return res.status(500).send('The product can not be updated')
  }

    res.status(200).send(product)
})


//  *** delete product

productsRouter.delete('/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
  .then(product => {
    if(product) {
      return res.status(200).json({success: true, message: 'product deleted successfuly'})
    } else {
      return res.status(404).json({success: false, message: 'product not found'})
    }
  })
  .catch(error => {
    return res.status(400).json({error: error})
  })
})

// products count 
productsRouter.get('/get/count', async (req, res) => {
  const productCount = await Product.countDocuments()

  if(!productCount) {
    res.status(500).json({success: false})
  }
  res.send({productCount : productCount})
})

// check if product is featured 
productsRouter.get('/get/featured/:count', async (req, res) => {

  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({isFeatured : true}).limit(+count)

  if(!products) {
    res.status(500).json({success: false})
  } 
  res.send(products)
})


module.exports = productsRouter