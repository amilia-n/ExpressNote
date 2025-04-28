import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server';
import { TEST_USER } from './setup';

// Mock auth middleware
vi.mock('../middleware/auth', () => ({
  default: (req, res, next) => {
    req.user = TEST_USER;
    next();
  }
}));

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access to protected routes with mocked authentication', async () => {
    const response = await request(app)
      .get('/api/notes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should have the correct user ID in the database', async () => {
    // Create a new note
    const createResponse = await request(app)
      .post('/api/notes')
      .send({ title: 'Auth Test Note' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('note_id');
    
    const noteId = createResponse.body.note_id;
    const getResponse = await request(app)
      .get(`/api/notes/${noteId}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('user_id', TEST_USER.user_id);
  });
}); 