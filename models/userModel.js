const mongoose = require('mongoose')

// product Schema and model 

const userSchema = mongoose.Schema({
 
  name: {
    type: String,
    required: true,
  },
  
  email: {
    type: String,
    required: true,
  },

  hashedPassword: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  street: {
    type: String,
    default: '',
  },

  apartment: {
    type: String,
    default: '',
  },

  city: {
    type: String,
    default: '',
  },
  
  zip: {
    type: String,
    default: '',
  },

  country: {
    type: String,
    default: '',
  },
})


userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

userSchema.set('toJSON', { virtuals: true })


exports.User = mongoose.model('User', userSchema)

