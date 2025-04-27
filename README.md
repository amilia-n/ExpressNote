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
- **DELETE** `/notes/:id`  
  Delete a specific note

## Page Routes (`/pages`)

- **POST** `/notes/:noteId/pages`  
  Add new page to note
- **GET** `/notes/:noteId/pages/:pageId`  
  Retrieve a specific page
- **DELETE** `/notes/:id`  
  Delete a specific note

## Block Routes (`/blocks`)

- **POST** `/notes/:noteId/pages/:pageId/blocks`  
  Create a new note
- **PUT** `/notes/:noteId/pages/:pageId/blocks`  
  Update block content or position
- **DELETE** `/notes/:noteId/pages/:pageId/blocks`  
  Delete a block

# Postman Testing:

1. Register: POST http://localhost:3000/auth/register
   Body: { "email": "test@email.com", "password": "password", "display_name": "mockuser1" }

2. Login: POST http://localhost:3000/auth/login
   Body: { "email": "test@email.com", "password": "password" }

3. Notes (add Authorization: Bearer <token> header):
   - Create: POST http://localhost:3000/notes
     body: { title }
     returns: { note_id, title, created_at }
   - Get All: GET http://localhost:3000/notes
   - Get One: GET http://localhost:3000/notes/:id
     returns: {
        note_id,
        title,
        pages: [{
          page_id,
          position,
          blocks: [{
            block_id,
            block_type,
            content,
            position,
            x,
            y
          }]
        }]
     }
   - Delete: DELETE http://localhost:3000/notes/:id

4. Page
   - Create: POST /notes/:noteId/pages
     body: { position }

5. Blocks
   - Create: POST /notes/:noteId/pages/:pageId/blocks
     body: {
      block_type, // 'text', 'code', or 'image'
      content,
      position,
      x,
      y
     }
   - Update/Move: PUT /notes/:noteId/pages/:pageId/blocks/:blockId
     body: {
      (updated)content,
      (updated)position,
      (updated)x,
      (updated)y
     }


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
- DaisyUI
- react-grid-layout 
- html2pdf.js

# Documentation Note:
## MAJOR CHANGES: 
- Remove AI rendering to implement during nice-to-have.
- Remove flashcards table.
- Schema update: note_id should save noteContainer with all TextEditor and CodeEditor (not each instance of TextEditor)
- Each note is made of multiple content blocks. 
- block_type will tell frontend whether to render a TextEditor, CodeEditor, or an Image Viewer.
- ✨ Updated Concept: 
(1) a Note → has many Pages (up to 10),
(2) a Page → has many Blocks,
(3) a Block → belongs to a Page
- Implement a grid snapping + drag/drop rearranging, this will also help with loading block positions. 
- Notes should be able to saved to local machine as pdf.