require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const pool = require("./db/connect");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Serialize/Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// TODO: Config Google Login
passport.use(
  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Profile = user Google info
      return done(null, profile);
    }
  )
);
// start Google Login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// handle callback from Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);
// route only works if user is logged in
app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/");
  res.send(`Welcome ${req.user.displayName}`);
});
// log-out route
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

console.log("Setting up routes...");

app.get("/test", (req, res) => {
  console.log("GET /test called");
  res.json({ message: "Server is working" });
});

app.post("/test-post", (req, res) => {
  console.log("POST /test-post called");
  const { data } = req.body;
  res.json({
    message: "Test endpoint working",
    receivedData: data,
  });
});

console.log("Routes set up");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
