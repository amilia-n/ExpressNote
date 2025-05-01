import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import pool from '../db/connect.js';
import fs from 'fs';
import path from 'path';

const SALT_ROUNDS = 10;

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Google Auth
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Google Auth Callback
export const googleCallback = async (req, res) => {
  try {
    const token = jwt.sign(
      { user_id: req.user.user_id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL 
      : 'http://localhost:5173';
    
    // Read the template file
    const template = await fs.promises.readFile(path.join(__dirname, '..', 'googleCallback.html'), 'utf8');
    
    // Replace placeholders
    const html = template
      .replace('{{token}}', token)
      .replace('{{redirectUrl}}', redirectUrl);
    
    res.send(html);
  } catch (err) {
    console.error('Google callback error:', err);
    res.status(500).send('Authentication failed. Please try again.');
  }
};

// Logout
export const logout = (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
};