import express from 'express';
import {
    googleAuth,
    googleCallback,
    logout,
    registerUser,
    loginUser,
  } from '../controllers/userController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', googleAuth);

router.get('/google/callback', googleCallback);

router.get('/logout', logout);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'This is your protected profile', user: req.user });
  });
  
export default router;
