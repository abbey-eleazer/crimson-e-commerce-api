const express = require('express')
const {Product} = require('../models/productsModel')
const productsRouter = express.Router();






// get all products 

productsRouter.get('/', async (req, res) => {
  const productList = await Product.find()

  if(!productList) {
    res.status(500).json({success: false})
  }
  res.send(productList)
})



// creating a new product 

productsRouter.post('/',async (req, res) => {
  
  const product = new Product({
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
})




module.exports = productsRouter
