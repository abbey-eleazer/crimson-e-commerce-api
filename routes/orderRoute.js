const express = require('express')
const {Order} = require('../models/orderModel')
const {OrderItem} = require('../models/orderItem')
const { populate } = require('dotenv')
const ordersRouter = express.Router()

//** Get all Orders */
ordersRouter.get('/', async (req, res) => {
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1})

  if(!orderList) {
    res.status(500).json({success: false})
  }
  res.send(orderList)
})


//** Get an Order */
ordersRouter.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id)
  .populate('user', 'name')
  .populate({ path: 'orderItem', populate: { path: 'product', populate: 'category'} })   // list order details

  if(!order) {
    res.status(500).json({success: false})
  }
  res.send(order)
})


//  *** create/add order
ordersRouter.post('/', async (req, res) => {

  const orderItemsIds = Promise.all( req.body.orderItems.map(async orderItem => {

    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })

    newOrderItem = await newOrderItem.save()

    return newOrderItem._id

  }))

  const orderItemsIdsResolved = await orderItemsIds

   // loop through order and get prices
  const totalPrices = await Promise.all( orderItemsIdsResolved.map( async (orderItemsId) => {
    
    const orderItem = await OrderItem.findById(orderItemsId).populate('product', 'price')   // getting the price of the item
    
    const totalPrice = orderItem.product.price * orderItem.quantity   // price of item X quantity
    return totalPrice
  }))

  const totalPrice = totalPrices.reduce((a,b) => a + b, 0)  // add price of all items

  let order = new Order({
   orderItems: orderItemsIdsResolved,
   shippingAddress1: req.body.shippingAddress1,
   shippingAddress2: req.body.shippingAddress2,
   city: req.body.city,
   zip: req.body.zip,
   country: req.body.country,
   phone: req.body.phone,
   status: req.body.status,
   totalPrice: totalPrice,
   user: req.body.user,
  })
  
  order = await order.save()
  
  if(!order) {
    return  res.status(404).send('order can not be found')
  }
  res.status(200).send(order)
})


// ***  update order status 
ordersRouter.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(
   req.params.id,
   {
     status: req.body.status
   },
   {new: true}
 )
  if(!order) 
   return res.status(400).send('Order can not be processed')
 
    res.status(200).send(order)
 
})



//  *** delete order
ordersRouter.delete('/:id', (req, res) => {

  Order.findByIdAndDelete(req.params.id)
  .then( async order => {

    if(order) {

      // remove order items after delete of order
       await order.orderItems.map( async orderItem => {
        await OrderItem.findByIdAndDelete(orderItem)
       })

      return res.status(200).json({success: true, message: 'order deleted successfuly'})
    } else {
      return res.status(404).json({success: false, message: 'order not found'})
    }

  })
  .catch(error => {
    return res.status(400).json({error: error})
  })
})



//get total sales

ordersRouter.get('/get/totalSales', async (req, res) => {
   const totalSales = await Order.aggregate([
     { $group: { _id: null, totalSales : { $sum : '$totalPrice'}} }
   ])

   if(!totalSales) {
    return res.status(400).send('The order sales cannot ge generated')
   }
   res.send({totalSales: totalSales.pop().totalSales })
})


// order count 
ordersRouter.get('/get/count', async (req, res) => {
  const orderCount = await Order.countDocuments()

  if(!orderCount) {
    res.status(500).json({success: false})
  }
  res.send({orderCount : orderCount})
})


//** Get users order list */
ordersRouter.get('/get/userorders/:userId', async (req, res) => {
  const userorderList = await Order.find({user: req.params.userId})
  .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category'} })   // list order details.sort({'dateOrdered': -1})

  if(!userorderList) {
    res.status(500).json({success: false})
  }
  res.send(userorderList)
})


module.exports = ordersRouter