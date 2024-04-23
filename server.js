const express = require('express')
const colors = require('colors')
require("dotenv").config()
const morgan = require('morgan')
const mongoose  = require('mongoose')
const db_connection = require('./config/db')
// const router = require('router')

const app = express();

const PORT = process.env.PORT || 3000
db_connection()

// middlewares 
app.use(express.json())
app.use(express.json({ extended: true }))
app.use(morgan('dev'))



// product Schema and model 

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: Number
})

const Product = mongoose.model('Product', productSchema)


// creating a new product 

app.post('/api/v1/products', (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock
  })

  product.save().then((createdProduct => {
    res.status(201).json(createdProduct)
  })).catch((err) => {
    res.status(500).json({
      error: err,
      success: false
    })
  })
})




app.listen(PORT, () => {
  console.log(`Server listening on port: http://localhost:${PORT}`.yellow);
})