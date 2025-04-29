CREATE DATABASE express_note;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  password TEXT,                       
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notes (
  note_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pages (
  page_id SERIAL PRIMARY KEY,
  note_id INTEGER REFERENCES notes(note_id) ON DELETE CASCADE,
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blocks (
  block_id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(page_id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL, 
  content TEXT, 
  position INTEGER, 
  x INTEGER, 
  y INTEGER, 
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);