README Planning
Project Intro
Instruction for Setup
Schema Breakdown
Route Structure:
/auth - Main authentication routes
/auth/google - Initiates Google OAuth
/auth/google/callback - Handles Google OAuth callback
/auth/register - Local user registration
/auth/login - Local user login
/auth/logout - Handles user logout
/auth/profile - Protected profile route

/notes - Main note routes (Protected)
/notes - GET: Retrieve all notes for authenticated user
/notes - POST: Create a new note
/notes/:id - GET: Retrieve a specific note
/notes/:id - PUT: Update a specific note
/notes/:id - DELETE: Delete a specific note

Visual Demo