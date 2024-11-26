// Import the express module
const express = require("express");
const AuthenticateRoutes = require("../authmiddleware/auth");
const messages = require("../controller/messages");

// Create a router instance
const router = express.Router();
router.post('/send', AuthenticateRoutes.protect, messages.sendMessage);

router.get('/getMessages',AuthenticateRoutes.protect,messages.getMessagesWithSender)


module.exports = router;
