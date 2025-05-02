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
  (req, res) => {
    console.log('Google callback successful');
    res.redirect(`${process.env.CLIENT_URL}/profile`);
  }
);

router.get("/logout", logout);

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
      "SELECT note_id, title, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
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

// Route for updating display name
router.put("/profile/display-name", authenticateToken, async (req, res) => {
  try {
    const { display_name } = req.body;
    const userId = req.user.user_id;

    const result = await pool.query(
      "UPDATE users SET display_name = $1 WHERE user_id = $2 RETURNING display_name",
      [display_name, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
