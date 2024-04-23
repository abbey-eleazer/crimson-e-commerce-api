// const Product = require('../models/productsModel')

// exports.addProduct = async (req, res, next) => {
//   const { name, photo, countInStock } = req.body
//   if( !name || !photo || !countInStock ){
//     res.json({error: 'All fields are required'})
//     return false
//   }

//   try {
//     const product = await Product.create({
//       name: req.body.name,
//        photo: req.body.photo,
//         countInStock: req.body.countInStock
//     })

//     res.status(201).json({ message: 'Product added successfuly', data: product,})

//   } catch (error) {
//     next (error)
//   }
// }

