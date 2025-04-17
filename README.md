Project Intro: Express Notes - A note-taking application with authentication

Instruction for Setup: 
1. Clone repository
2. Install dependencies: npm install
3. Create .env file with required variables
4. Generate secrets using Node:
   ```bash
   # For JWT Secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # For Session Secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. Start server: npm start

Schema Breakdown: PostgreSQL database with users and notes tables

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

Postman Testing:
1. Register: POST http://localhost:3000/auth/register
   Body: { "email": "test@email.com", "password": "password" }

2. Login: POST http://localhost:3000/auth/login
   Body: { "email": "test@email.com", "password": "password" }

3. Notes (add Authorization: Bearer <token> header):
   - Create: POST http://localhost:3000/notes
     Body: { "title": "Test", "content": "Content" }
   - Get All: GET http://localhost:3000/notes
   - Get One: GET http://localhost:3000/notes/:id
   - Update: PUT http://localhost:3000/notes/:id
     Body: { "title": "Updated", "content": "Updated" }
   - Delete: DELETE http://localhost:3000/notes/:id

Visual Demo