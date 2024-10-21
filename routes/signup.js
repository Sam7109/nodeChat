// Import the express module
const express = require('express');

// Create a router instance
const router = express.Router(); 
const signup = require('../controller/userdetails')

router.post('/registeruser',signup.postUserdetails)



module.exports = router ;
