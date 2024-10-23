// Import the express module
const express = require('express');
const AuthenticateRoutes = require('../authmiddleware/auth')

// Create a router instance
const router = express.Router(); 
const signup = require('../controller/userdetails')

router.post('/registeruser',signup.postUserdetails)
router.post('/isValidUser',signup.isValidUser)


module.exports = router ;
