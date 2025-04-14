const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserData,getEmail } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get ('/userdetails', getUserData);
// router.get('/get-email/:userId', getEmail);

module.exports = router;

