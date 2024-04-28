const express = require('express')
const { User } = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usersRouter = express.Router()

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
      { userId: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' }
    )
    res.status(200).send({ user: user.email, token: token })

  }else{
      res.status(400).send('Invalid credentials')
  }
  // return res.status(200).send(user )
})

module.exports = usersRouter