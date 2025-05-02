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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.enable('trust proxy');
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware - must be before routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true, 
}));

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
    secure: false, // Set to false for local development
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
  // PROD SETTING
  // cookie: {
  //   secure: process.env.NODE_ENV === 'production',
  //   maxAge: 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  //   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.use(express.static(path.join(__dirname, 'public')));



// API Routes
app.use('/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blocks', blockRoutes);

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/notes");
});


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


export default app;
