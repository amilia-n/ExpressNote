import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import pool from '../db/connect.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const SALT_ROUNDS = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id, email',
      [email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

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
    
    const template = await fs.promises.readFile(path.join(__dirname, '..', 'googleCallback.html'), 'utf8');
    //alt to^
    // const template = await fs.promises.readFile(
    //   new URL('../googleCallback.html', import.meta.url),
    //   'utf8'
    // );
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

export const logout = (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const userResult = await pool.query(
      'SELECT email, display_name, created_at FROM users WHERE user_id = $1',
      [userId]
    );
    
    const notesResult = await pool.query(`
      SELECT n.note_id, n.title, n.created_at, n.updated_at,
             p.page_id, b.content
      FROM notes n
      LEFT JOIN pages p ON n.note_id = p.note_id
      LEFT JOIN blocks b ON p.page_id = b.page_id
      WHERE n.user_id = $1
      ORDER BY n.updated_at DESC
    `, [userId]);
    
    res.json({
      user: userResult.rows[0],
      notes: notesResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDisplayName = async (req, res) => {
  try {
    const { display_name } = req.body;
    const userId = req.user.user_id;
    
    const result = await pool.query(
      'UPDATE users SET display_name = $1 WHERE user_id = $2 RETURNING display_name',
      [display_name, userId]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};