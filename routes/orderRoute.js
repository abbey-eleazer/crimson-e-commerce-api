const express = require('express')
const {Order} = require('../models/orderModel')
const ordersRouter = express.Router()


ordersRouter.get('/', async (req, res) => {
  const orderList = await Order.find()

  if(!orderList) {
    res.status(500).json({success: false})
  }
  res.send(orderList)
})


module.exports = ordersRouter