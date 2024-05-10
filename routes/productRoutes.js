const express = require('express')
const {Product} = require('../models/productsModel')
const {Category} = require('../models/categoryModel')
const productsRouter = express.Router()
const mongoose  = require('mongoose')
const multer = require('multer')


const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
}

const storage = multer.diskStorage ({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('Invalid image type')

    if(isValid) {
      uploadError = null
    }
    cb( null, 'public/upload')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({storage: storage})


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

productsRouter.post('/', uploadOptions.single('image'), async (req, res) => {

 
  //  validate category

  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('Invalid Category')
  
  const file = req.file
  if(!file) return res.status(400).send('No image in the request')
  const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/upload/`

  //  create product

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    detailedDescription: req.body.detailedDescription,
    image: `${basePath}${fileName}`, //"http://localhost:3000/public/upload/image-2323232"
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
  
  if(!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid product id')
  }
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


productsRouter.put('/gallery-images/:id', uploadOptions.array('images', 8), async (req, res) => {
  
  if(!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid product id')
  }
  const files = req.files
  let imagesPaths = []
  const basePath = `${req.protocol}://${req.get('host')}/public/upload/`

  if(files) {
    files.map(file => {
      imagesPaths.push(`${basePath}${file.fileName}`)
    })
  }

  const product = await Product.findByIdAndUpdate(
   req.params.id,
   {
    images: imagesPaths,
   },
   {new: true}
  )
   
   if(!product) {
     return res.status(500).send('The product can not be updated')
   }
 
     res.status(200).send(product)
  
})



module.exports = productsRouter