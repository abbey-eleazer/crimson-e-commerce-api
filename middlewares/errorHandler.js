const { UnauthorizedError, validationError } = require("express-jwt")

function errorHandler( err, req, res, next){
  if(err.name === UnauthorizedError) {
    return  res.status(401).json({ message: 'You are not Authorizd'})
  }

  if(err.name === validationError) {
    return res.status(401).json({ message: err})
    }
    return res.status(500).json({message : err.message})
  }

  module.exports = errorHandler 