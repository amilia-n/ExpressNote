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
import path from 'path';
import { fileURLToPath } from 'url';
import pgSession from 'connect-pg-simple';

const app = express();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,OPTIONS, DELETE'
}
app.use(cors(corsOptions));

// Session middleware
const PostgresStore = pgSession(session);
app.use(session({
  store: new PostgresStore({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blocks', blockRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/notes");
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
