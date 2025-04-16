require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const { googleAuth, googleCallback, logout } = require('./controllers/userController');
const app = express();
const pool = require("./db/connect");

require("./controllers/userController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(
    // session to track logged-in user
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    // creates a session even if nothing is stored yet 
    // change to false in production for efficiency
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());


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

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
