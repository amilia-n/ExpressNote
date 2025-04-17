// Authentication routes for Google login

const express = require('express');
const router = express.Router();
const {
    googleAuth,
    googleCallback,
    logout,
    registerUser,
    loginUser,
  } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/google', googleAuth);

router.get('/google/callback', googleCallback);

router.get('/logout', logout);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'This is your protected profile', user: req.user });
  });
  
module.exports = router;
