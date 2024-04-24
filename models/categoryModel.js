const mongoose = require('mongoose')

const categorySchema = mongoose.Schema ({

  name: {
    type: String,
    required: true
  },
  
  image: {
    type: String,
    defualt: '',
  },

  icon: {
    type: String,
    defualt: '',
  },

  color: {
    type: String,
    defualt: '',
  },

})

exports.Category = mongoose.model('Category', categorySchema)