const {Category} = require('../models/categoryModel')
const express = require('express')
const categoryRouter = express.Router()


categoryRouter.get('/', async (req, res) => {
  const categoryList = await Category.find()

  if(!categoryList) {
    res.status(500).json({success: false})
  }
  res.send(categoryList)
})

module.exports = categoryRouter