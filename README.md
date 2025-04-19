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
/notes - POST: Create a new note
/notes/:id - GET: Retrieve a specific note
/notes/:id - PUT: Update a specific note
/notes/:id - DELETE: Delete a specific note

/cards - Flashcard routes (Protected)
/cards/generate - POST: Generate flashcards from note content
Body: {
"content": "Your note content",
"note_id": "ID of the note to associate flashcards with"
}
/cards/:note_id - GET: Retrieve all flashcards for a specific note
/cards/:card_id - PUT: Update a specific flashcard
Body: {
"header": "Updated header",
"summary": "Updated summary",
"editable": true
}
/cards/:card_id - DELETE: Delete a specific flashcard

Postman Testing:

1. Register: POST http://localhost:3000/auth/register
   Body: { "email": "test@email.com", "password": "password", "display_name": "mockuser1" }

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

4. Flashcards (add Authorization: Bearer <token> header):
   - Generate: POST http://localhost:3000/cards/generate
     Body: {
     "content": "Your note content to generate flashcards from",
     "note_id": "ID of the note to associate with"
     }
   - Get By Note: GET http://localhost:3000/cards/:note_id
   - Update: PUT http://localhost:3000/cards/:card_id
     Body: {
     "header": "Updated header",
     "summary": "Updated summary",
     "editable": true
     }
   - Delete: DELETE http://localhost:3000/cards/:card_id

Testing Tools:
Backend: Vitest + Axios
*   npm install -D vitest
*   npm install -D axios-mock-adapter
      Mock Axios requests in unit/integration tests
*   npm install -D node-mocks-http
      Mock Express req/res/next for middleware/controllers
*   npm install -D pg-mem
      Mock PostgreSQL


Visual Demo
