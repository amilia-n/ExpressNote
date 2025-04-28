import { vi } from 'vitest';
import { newDb } from 'pg-mem';

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

// Test data with consistent id field usage
export const TEST_USER = {
  user_id: 1,
  google_id: null,
  email: 'test@example.com',
  display_name: 'Test User',
  password: '$2b$10$test',
  created_at: new Date()
};

export const TEST_NOTE = {
  note_id: 1,
  user_id: TEST_USER.user_id,
  title: 'Test Note',
  created_at: new Date(),
  updated_at: new Date()
};

export const TEST_PAGE = {
  page_id: 1,
  note_id: TEST_NOTE.note_id,
  position: 0,
  created_at: new Date(),
  updated_at: new Date()
};

export const TEST_BLOCK = {
  block_id: 1,
  page_id: TEST_PAGE.page_id,
  block_type: 'text',
  content: 'Test Block Content',
  position: 0,
  x: 0,
  y: 0,
  created_at: new Date(),
  updated_at: new Date()
};

// Create pg-mem database instance
const db = newDb({
  autoCreateForeignKeyIndices: true
});

// Register NOW() function
db.public.registerFunction({
  name: 'NOW',
  returns: 'timestamptz',
  implementation: () => new Date(),
  impure: true,
});

// Import my schema
const schema = `
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
`;

// Execute schema
for (const statement of schema.split(';').filter(s => s.trim())) {
    try {
    console.log('Executing schema statement:', statement.trim());
    db.public.query(statement);
    console.log('Schema statement executed successfully');
    } catch (error) {
    console.error('Error executing schema statement:', error);
      throw error;
    }
}

// Mock pool for tests
const mockPool = {
  query: async (text, params = []) => {
    // For auth tests, just return the test user data
    if (text.toLowerCase().includes('select') && text.toLowerCase().includes('users')) {
      return {
        rows: [TEST_USER],
        rowCount: 1
      };
    }
    
    // Handle note creation
    if (text.toLowerCase().includes('insert into notes')) {
      const newNote = {
        note_id: 1, 
        title: params[1] || 'Test Note',
        user_id: params[0] || TEST_USER.user_id,
        created_at: new Date(),
        updated_at: new Date()
      };
      return {
        rows: [newNote],
        rowCount: 1
      };
    }

    // Handle note retrieval by ID
    if (text.toLowerCase().includes('select') && text.toLowerCase().includes('notes') && text.includes('note_id =')) {
      const noteId = params[0] || text.match(/note_id\s*=\s*(\d+)/)[1];
      if (noteId == TEST_NOTE.note_id || noteId == 1) {
        return {
          rows: [{
            ...TEST_NOTE,
            note_id: noteId,
            user_id: TEST_USER.user_id
          }],
          rowCount: 1
        };
      }
      return { rows: [], rowCount: 0 };
    }

    // Handle get all notes
    if (text.toLowerCase().includes('select') && text.toLowerCase().includes('notes') && text.toLowerCase().includes('user_id')) {
      return {
        rows: [TEST_NOTE],
        rowCount: 1
      };
    }

    // Handle note update
    if (text.toLowerCase().includes('update notes')) {
      const noteId = params[1] || text.match(/note_id\s*=\s*(\d+)/)[1];
      if (noteId == TEST_NOTE.note_id) {
        const updatedNote = {
          ...TEST_NOTE,
          title: params[0] || text.match(/title\s*=\s*'([^']+)'/)[1],
          updated_at: new Date()
        };
        return {
          rows: [updatedNote],
          rowCount: 1
        };
      }
      return { rows: [], rowCount: 0 };
    }

    // Handle note deletion
    if (text.toLowerCase().includes('delete from notes')) {
      const noteId = params[0] || text.match(/note_id\s*=\s*(\d+)/)[1];
      return {
        rows: [],
        rowCount: noteId == TEST_NOTE.note_id ? 1 : 0
      };
    }

    // Handle page creation
    if (text.toLowerCase().includes('insert into pages')) {
      const noteId = params[0] || text.match(/note_id\s*=\s*(\d+)/)[1];
      if (noteId == TEST_NOTE.note_id) {
        const newPage = {
          page_id: TEST_PAGE.page_id,
          note_id: noteId,
          position: params[1] || 0,
          created_at: new Date(),
          updated_at: new Date()
        };
        return {
          rows: [newPage],
          rowCount: 1
        };
      }
      return { rows: [], rowCount: 0 };
    }

    // Handle page retrieval by ID
    if (text.toLowerCase().includes('select') && text.toLowerCase().includes('pages') && text.includes('page_id =')) {
      const pageId = params[0] || text.match(/page_id\s*=\s*(\d+)/)[1];
      if (pageId == TEST_PAGE.page_id) {
        return {
          rows: [TEST_PAGE],
          rowCount: 1
        };
      }
      return { rows: [], rowCount: 0 };
    }

    // Handle get pages by note ID
    if (text.toLowerCase().includes('select') && text.toLowerCase().includes('pages') && text.includes('note_id =')) {
      const noteId = params[0] || text.match(/note_id\s*=\s*(\d+)/)[1];
      if (noteId == TEST_NOTE.note_id) {
        return {
          rows: [TEST_PAGE],
          rowCount: 1
        };
      }
      return { rows: [], rowCount: 0 };
    }

    // Handle page position update
    if (text.toLowerCase().includes('update pages') && text.toLowerCase().includes('position')) {
      const pageId = params[1] || text.match(/page_id\s*=\s*(\d+)/)[1];
      if (pageId == TEST_PAGE.page_id) {
        const updatedPage = {
          ...TEST_PAGE,
          position: params[0] || text.match(/position\s*=\s*(\d+)/)[1],
          updated_at: new Date()
        };
        return {
          rows: [updatedPage],
          rowCount: 1
        };
      }
      return { rows: [], rowCount: 0 };
    }

    // Handle page deletion
    if (text.toLowerCase().includes('delete from pages')) {
      const pageId = params[0] || text.match(/page_id\s*=\s*(\d+)/)[1];
      return {
        rows: [],
        rowCount: pageId == TEST_PAGE.page_id ? 1 : 0
      };
    }
    
    // For other queries, return empty results
    return {
      rows: [],
      rowCount: 0
    };
  },
  end: async () => {

  }
};


vi.mock('../db/connect', () => ({
  default: mockPool
}));

vi.mock('../middleware/authMiddleware', () => ({
  default: (req, res, next) => {
    req.user = TEST_USER;
    next();
  }
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(() => TEST_USER),
    sign: vi.fn(() => 'mock-jwt-token')
  }
}));

vi.mock('passport', () => ({
  default: {
    use: vi.fn(),
    serializeUser: vi.fn(),
    deserializeUser: vi.fn(),
    initialize: () => (req, res, next) => next(),
    session: () => (req, res, next) => next(),
    authenticate: () => (req, res, next) => {
      req.user = TEST_USER;
      next();
    }
  }
}));

vi.mock('passport-google-oauth20', () => ({
  Strategy: class MockStrategy {
    constructor(options, callback) {
      this.name = 'google';
      this.callback = callback;
    }
  }
}));

beforeAll(() => {});
afterAll(() => {
  vi.clearAllMocks();
});
beforeEach(() => {});
