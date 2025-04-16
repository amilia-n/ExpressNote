require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require('../db/connect'); 

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails } = profile;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);
    if (userRes.rows.length) return done(null, userRes.rows[0]);

    const newUser = await pool.query(
      'INSERT INTO users (google_id, display_name, email) VALUES ($1, $2, $3) RETURNING *',
      [id, displayName, emails[0].value]
    );
    return done(null, newUser.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err);
  }
});

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
exports.googleCallback = passport.authenticate('google', {
  session: true,
  successRedirect: '/profile',
  failureRedirect: '/',
});

exports.logout = (req, res) => {
  req.logout(() => res.redirect('/'));
};

exports.registerUser = async (req, res) => {
  const { display_name, email, password } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await pool.query(
      'INSERT INTO users (display_name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [display_name, email, hashed]
    );
    res.status(201).json({ message: 'User registered', user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
};