const mongoose = require('mongoose')

// product Schema and model 

const productSchema = mongoose.Schema({
  
  name:{ 
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true,
  },

  detailedDescription: {
    type: String,
    defualt: '',
  },

  image: {
    type: String,
    defualt: '',
  },

  images:[ 
    {
    type: String,
    defualt: '',
   }
  ],

  brand: {
    type: String,
    defualt: '',
  },

  price: {
    type: Number,
    defualt: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },

  rating: {
    type: Number,
    defualt: 0,
  },

  numReviews: {
    type: Number,
    defualt: 0,
  },

  dateCreated: {
    type: Date,
    defualt: Date.now,
  },

  isFeatured: {
    type: Boolean,
    defualt: false,
  },
})

productSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

productSchema.set('toJSON', { virtuals: true })


exports.Product = mongoose.model('Product', productSchema)

