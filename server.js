const express = require('express')
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const colors = require('colors')
require("dotenv").config()
const db_connection = require('./config/db')
const authJwt = require('./middlewares/jwt')
const errorHandler = require('./middlewares/errorHandler')


db_connection()     //  DB connection
const PORT = process.env.PORT || 3000

// ****  Middlewares  ****
app.use(express.json())
app.use(express.json({ extended: true }))
app.use(morgan('dev'))
app.use(cors())
app.options('*',cors())
app.use(authJwt())
app.use(errorHandler)

// ****  Models  ****
const Product = require('./models/productsModel')
const User = require('./models/userModel')
const category = require('./models/categoryModel')
const order = require('./models/orderModel')

// ****  Routes  ****
const productsRouter = require('./routes/productRoutes')
const usersRouter = require('./routes/userRoute')
const categoriesRouter = require('./routes/categoryRoute')
const ordersRouter = require('./routes/orderRoute')



 // ****  Route URL ****
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/orders', ordersRouter)

 

app.listen(PORT, () => {
  console.log(`Server listening on port: http://localhost:${PORT}`.yellow);
})