require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require('../db/connect'); 

const SALT_ROUNDS = 10;

//GOOGLE STRATEGY 
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
// GOOGLE AUTH HANDLERS
exports.googleAuth = passport.authenticate('google', { 
  scope: ['profile', 'email'] 
});
exports.googleCallback = passport.authenticate('google', {
  session: true,
  successRedirect: '/profile',
  failureRedirect: '/',
});

exports.logout = (req, res) => {
  req.logout(() => res.redirect('/'));
};
//LOCAL REGISTER
exports.registerUser = async (req, res) => {
  const { displayName, email, password } = req.body;

  if (!displayName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save new user
    const newUser = await pool.query(
      `INSERT INTO users (display_name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING user_id, display_name, email`,
      [displayName, email, hashedPassword]
    );

    const user = newUser.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ 
      message: "User registered",
      user: {
        user_id: user.user_id,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (err) {
    console.error('Registration error details:', err);
    res.status(500).json({ 
      error: "Server error",
      details: err.message 
    });
  }
};

// LOCAL LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    console.log('Querying database for user...');
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Database query result:', result.rows.length > 0 ? 'User found' : 'User not found');
    
    const user = result.rows[0];
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (!user.password) {
      console.log('No password set for user');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing passwords...');
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match ? 'Yes' : 'No');
    
    if (!match) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Generating JWT token...');
    let token;
    try {
      token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      console.log('JWT token generated successfully');
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ 
        message: 'Error generating token',
        details: jwtError.message 
      });
    }
    
    res.json({ 
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (err) {
    console.error('Login error details:', err);
    res.status(500).json({ 
      message: 'Login error',
      details: err.message 
    });
  }
};