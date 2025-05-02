import express from 'express';
import passport from "passport";
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

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: true
  }), 
  (req, res) => {
    console.log('Logged in user:', req.user);
    res.redirect(`${process.env.CLIENT_URL}/notes`); 
  }
);
//   }),
//   googleCallback
// );

router.get('/logout', logout);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const userResult = await pool.query(
      'SELECT email, display_name, created_at FROM users WHERE user_id = $1',
      [userId]
    );
    
    const notesResult = await pool.query(
      'SELECT note_id, title, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    
    res.json({
      user: userResult.rows[0],
      notes: notesResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
export default router;
