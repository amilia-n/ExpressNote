require("dotenv").config();
const passport = require('passport');
const pool = require('../db/connect'); 

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/',
});

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Logout failed');
    res.redirect('/');
  });
};

passport.use(new (require('passport-google-oauth20').Strategy)({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, photos } = profile;

  try {
    const user = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);

    if (user.rows.length > 0) {
      const existingUser = user.rows[0];
      return done(null, existingUser);
    } else {
      const newUser = await pool.query(
        'INSERT INTO users (google_id, display_name, email, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, displayName, emails[0].value, photos[0].value]
      );
      return done(null, newUser.rows[0]);
    }
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
