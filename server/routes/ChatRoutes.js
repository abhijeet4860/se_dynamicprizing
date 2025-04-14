const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatcontroller'); // import the controller function

router.post('/send', chatController.chat); // use the chat function from the controller

module.exports = router;
