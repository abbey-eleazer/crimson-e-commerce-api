const { expressjwt: jwt } = require('express-jwt')
const {User} = require('../models/userModel')

function authJwt() {

const JWT_SECRET = process.env.JWT_SECRET_KEY

  return jwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      {url: /\/api\/v1\/products{.*}/ , methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/categories{.*}/ , methods: ['GET', 'OPTIONS']},
      '/api/v1/users/login',
      '/api/v1/users/signup',
    ]
  })
}

async function isRevoked(req, payload) {
  console.log(payload);
  if (payload.isAdmin == false) {
    console.log('Not Admin');
    return true;
  }
  console.log('Admin');
  return false;
}


module.exports = authJwt