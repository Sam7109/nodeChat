// Import the express module
const express = require("express");
const AuthenticateRoutes = require("../authmiddleware/auth");

const messages = require("../controller/messages");
const groupcreation = require("../controller/groupscreation");

// Create a router instance
const router = express.Router();
router.post('/sendmessage', AuthenticateRoutes.protect, messages.sendMessage);

router.get('/getMessages',AuthenticateRoutes.protect,messages.getGroupMessages);

//groups creation 
router.get('/getUserGroups',AuthenticateRoutes.protect,groupcreation.getUserGroups)
router.post('/creategroups',AuthenticateRoutes.protect,groupcreation.createGroup)

router.post('/addUserToGroup',AuthenticateRoutes.protect,groupcreation.addMemberToGroup)


module.exports = router;
