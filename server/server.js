require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();

// Connect to database
const pool = require("./db/connect");

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false, // false only for development. process.env.NODE_ENV === 'production'
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: false //false for dev
  },
  rolling: true 
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
require("./controllers/userController");

// Routes
// AuthRoute + UserRoute
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Home Page'));

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/");
  console.log('User object:', req.user);
  res.send(`Welcome ${req.user.display_name}`);
});
// NoteRoute
const noteRoutes = require('./routes/noteRoutes');
app.use('/notes', noteRoutes);

// CardRoute
const cardRoutes = require('./routes/cardRoutes');
app.use('/cards', cardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
