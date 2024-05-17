const express = require('express')
const { User } = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usersRouter = express.Router()
const joi = require('joi')

// *** get all users
usersRouter.get('/', async (req, res) => {
  const userList = await User.find()

  if(!userList) {
    res.status(500).json({success: false })
  }
  res.send(userList)
})


// ***  get one user 
usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-hashedPassword')
  if(user) {
   return res.status(200).send(user)
 } else {
   return res.status(404).json({success: false, message: 'user not found'})
 }
})


//  *** signup user
usersRouter.post('/signup', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    hashedPassword: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
  })
  
  user = await user.save()

//   const validate = (user) => {
//     const schema = Joi.object({
//         name: Joi.string().required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().required(),
//     });
//     return schema.validate(user);
// };
  
  if(!user) {
    return  res.status(404).send('user can not be found')
  }
 
  
    res.status(200).send(user)
})



// *** login user

usersRouter.post('/login', async (req, res) => {
  const user = await User.findOne({email: req.body.email})
const JWT_SECRET = process.env.JWT_SECRET_KEY


  if(!user) {
    return res.status(400).send('User not found')
  }

  if(user && bcrypt.compareSync(req.body.password, user.hashedPassword)){

    // login token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '3d' }
    )
    res.status(200).send({ user: user.email, token: token })

  }else{
      res.status(400).send('Invalid credentials')
  }
  // return res.status(200).send(user )
})

//  *** delete user

usersRouter.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
  .then(user => {
    if(user) {
      return res.status(200).json({success: true, message: 'user deleted successfuly'})
    } else {
      return res.status(404).json({success: false, message: 'user not found'})
    }
  })
  .catch(error => {
    return res.status(400).json({error: error})
  })
})


// user count 
usersRouter.get('/get/count', async (req, res) => {
  const userCount = await User.countDocuments()

  if(!userCount) {
    res.status(500).json({success: false})
  }
  res.send({userCount : userCount})
})

module.exports = usersRouter