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
  resave: false,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
require("./controllers/userController");

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Home Page'));

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/");
  res.send(`Welcome ${req.user.displayName}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
