Project Intro: Express Notes - A note-taking application with authentication

# Instruction for Setup:

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

# API Route Structure

## Authentication Routes (`/auth`)

- **GET** `/auth/google`  
  Initiates Google OAuth
- **GET** `/auth/google/callback`  
  Handles Google OAuth callback
- **POST** `/auth/register`  
  Local user registration
- **POST** `/auth/login`  
  Local user login
- **POST** `/auth/logout`  
  Handles user logout
- **GET** `/auth/profile`  
  Protected profile route

## Note Routes (Protected) (`/notes`)

- **POST** `/notes`  
  Create a new note
- **GET** `/notes/:id`  
  Retrieve a specific note
- **PUT** `/notes/:id`  
  Update a specific note
- **DELETE** `/notes/:id`  
  Delete a specific note

## Flashcard Routes (Protected) (`/cards`)

- **POST** `/cards/generate`  
  Generate flashcards from note content  
  **Body:**
  ```json
  {
    "content": "Your note content",
    "note_id": "ID of the note to associate flashcards with"
  }
  ```
- **GET** `/cards/:note_id`  
  Retrieve all flashcards for a specific note
- **PUT** `/cards/:card_id`  
   Update a specific flashcard
  **Body:**
  ```json
  {
   "header": "Updated header",
   "summary": "Updated summary",
   "editable": true
  }
  ```
- **DELETE** `/cards/:card_id`  
  Delete a specific flashcard


# Postman Testing:

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

# Testing Tools:
## Backend: Vitest + Axios
- npm install -D vitest
- npm install -D axios-mock-adapter
  Mock Axios requests in unit/integration tests
- npm install -D node-mocks-http
  Mock Express req/res/next for middleware/controllers
- npm install -D pg-mem
  Mock PostgreSQL

# Frontend Tools:
- codemirror @codemirror/view @codemirror/state
- slate slate-react

# Frontend (Dev) Path:
App renders Home, Home renders NoteEditor, NoteEditor renders CodeEditor
Visual Demo


# Documentation Note:
- MAJOR CHANGES: 
- Remove AI rendering to implement during nice-to-have.
- Remove flashcards table.
- Schema update: note_id should save noteContainer with all TextEditor and CodeEditor (not each instance of TextEditor)
- Each note is made of multiple content blocks. 
- block_type will tell frontend whether to render a TextEditor, CodeEditor, or an Image Viewer.
- Implement a grid snapping + drag/drop rearranging, this will also help with loading block positions. 