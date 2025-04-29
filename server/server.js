import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from 'cors';
import pool from "./db/connect.js";
import "./passportConfig.js";  
import "./controllers/userController.js";
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import blockRoutes from './routes/blockRoutes.js';


const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware - must be before routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false, // false only for development. process.env.NODE_ENV === 'production'
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: false //true to hide cookie
  },
  rolling: true 
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use('/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blocks', blockRoutes);


app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/");
  console.log('User object:', req.user);
  res.send(`Welcome ${req.user.display_name}`);
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
