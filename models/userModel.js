const mongoose = require('mongoose')

// product Schema and model 

const userSchema = mongoose.Schema({
  
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true
  }
})

exports.User = mongoose.model('User', userSchema)

