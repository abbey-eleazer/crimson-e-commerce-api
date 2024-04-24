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


// ***  get one category 
categoryRouter.get('/:id', async (req, res) => {
   const category = await Category.findById(req.params.id)
   if(category) {
    return res.status(200).send(category)
  } else {
    return res.status(404).json({success: false, message: 'category not found'})
  }
})


// ***  update category 
categoryRouter.put('/:id', async (req, res) => {
   const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      image: req.body.image,
      icon: req.body.icon
    }
  )
   if(category) {
    return res.status(200).send(category)
  } else {
    return res.status(404).json({success: false, message: 'category not found'})
  }
})


//  *** create/add category
categoryRouter.post('/', async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
    image: req.body.image,
  })

  category = await category.save()

  if(!category) {
   return  res.status(404).send('category can not be found')
  }
  res.status(200).send(category)
})



//  *** delete category
categoryRouter.delete('/:id', (req, res) => {
  Category.findByIdAndDelete(req.params.id)
  .then(category => {
    if(category) {
      return res.status(200).json({success: true, message: 'Category deleted successfuly'})
    } else {
      return res.status(404).json({success: false, message: 'category not found'})
    }
  })
  .catch(error => {
    return res.status(400).json({error: error})
  })
})
module.exports = categoryRouter