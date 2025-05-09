import express from "express";
import passport from "passport";
import {
  googleAuth,
  googleCallback,
  logout,
  registerUser,
  loginUser,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/authMiddleware.js";
import pool from "../db/connect.js";

const router = express.Router();

router.get("/google", googleAuth);

router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  googleCallback
  // (req, res) => {
  //   console.log('Google callback successful');
  //   res.redirect(`${process.env.CLIENT_URL}/profile`);
  // }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log("Fetching profile for user ID:", userId);

    const userResult = await pool.query(
      "SELECT user_id, email, display_name, created_at FROM users WHERE user_id = $1",
      [userId]
    );
    console.log("User query result:", userResult.rows);

    const notesResult = await pool.query(
      `SELECT n.note_id, n.title, n.created_at, nd.description
       FROM notes n
       LEFT JOIN note_descriptions nd ON n.note_id = nd.note_id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC`,
      [userId]
    );
    console.log("Notes query result:", notesResult.rows);

    const responseData = {
      user: userResult.rows[0],
      notes: notesResult.rows,
    };
    console.log("Sending response:", responseData);

    res.json(responseData);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile/display-name', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { display_name } = req.body;

    const result = await pool.query(
      'UPDATE users SET display_name = $1 WHERE user_id = $2 RETURNING display_name',
      [display_name, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ display_name: result.rows[0].display_name });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;