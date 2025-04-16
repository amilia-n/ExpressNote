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

router.get('/google', googleAuth);

router.get('/google/callback', googleCallback);

router.get('/logout', logout);

router.post('/register', registerUser);

router.post('/login', loginUser);

module.exports = router;
