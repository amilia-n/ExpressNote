import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { TEST_USER, TEST_NOTE, TEST_PAGE, TEST_BLOCK } from './setup';

// Mock db connect
vi.mock('../db/connect.js', () => {
  const mockPool = {
    query: vi.fn(),
    end: vi.fn()
  };
  return { default: mockPool };
});

import app from '../server.js';
import pool from '../db/connect.js';

describe('Server API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pool.query.mockImplementation((query, params) => {
      if (query.includes('SELECT * FROM users')) {
        return Promise.resolve({ rows: [TEST_USER] });
      }
      if (query.includes('SELECT * FROM notes')) {
        return Promise.resolve({ rows: [TEST_NOTE] });
      }
      if (query.includes('SELECT * FROM pages')) {
        return Promise.resolve({ rows: [TEST_PAGE] });
      }
      if (query.includes('SELECT * FROM blocks')) {
        return Promise.resolve({ rows: [TEST_BLOCK] });
      }

      if (query.includes('INSERT INTO notes')) {
        const newNote = {
          note_id: TEST_NOTE.note_id,
          user_id: params[0],
          title: params[1],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return Promise.resolve({ rows: [newNote] });
      }
      if (query.includes('INSERT INTO pages')) {
        const newPage = {
          page_id: TEST_PAGE.page_id,
          note_id: params[0],
          position: params[1],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return Promise.resolve({ rows: [newPage] });
      }
      if (query.includes('INSERT INTO blocks')) {
        const newBlock = {
          block_id: TEST_BLOCK.block_id,
          page_id: params[0],
          block_type: params[1],
          content: params[2],
          position: params[3],
          x: params[4],
          y: params[5],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return Promise.resolve({ rows: [newBlock] });
      }

      if (query.includes('UPDATE notes')) {
        const updatedNote = {
          ...TEST_NOTE,
          title: params[0],
          updated_at: new Date().toISOString()
        };
        return Promise.resolve({ rows: [updatedNote] });
      }
      if (query.includes('UPDATE pages')) {
        const updatedPage = {
          ...TEST_PAGE,
          position: params[0],
          updated_at: new Date().toISOString()
        };
        return Promise.resolve({ rows: [updatedPage] });
      }
      if (query.includes('UPDATE blocks')) {
        const updatedBlock = {
          ...TEST_BLOCK,
          content: params[0],
          position: params[1],
          x: params[2],
          y: params[3],
          updated_at: new Date().toISOString()
        };
        return Promise.resolve({ rows: [updatedBlock] });
      }

      if (query.includes('DELETE FROM')) {
        return Promise.resolve({ rows: [{ id: params[0] }] });
      }

      return Promise.resolve({ rows: [] });
    });
  });

  describe('Notes API', () => {
    it('should create a new note', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ title: 'Test Note' })
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('note_id');
      expect(response.body.title).toBe('Test Note');
    });

    it('should get all notes', async () => {
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a note by id', async () => {
      const response = await request(app)
        .get(`/api/notes/${TEST_NOTE.note_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(response.body.note_id).toBe(TEST_NOTE.note_id);
    });

    it('should update a note', async () => {
      const response = await request(app)
        .put(`/api/notes/${TEST_NOTE.note_id}`)
        .send({ title: 'Updated Note' })
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Note');
    });

    it('should delete a note', async () => {
      const response = await request(app)
        .delete(`/api/notes/${TEST_NOTE.note_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(204);
    });
  });

  describe('Pages API', () => {
    it('should create a new page', async () => {
      const response = await request(app)
        .post('/api/pages')
        .send({ note_id: TEST_NOTE.note_id, position: 1 })
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('page_id');
      expect(response.body.note_id).toBe(TEST_NOTE.note_id);
    });

    it('should get pages by note id', async () => {
      const response = await request(app)
        .get(`/api/pages?note_id=${TEST_NOTE.note_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a page by id', async () => {
      const response = await request(app)
        .get(`/api/pages/${TEST_PAGE.page_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(response.body.page_id).toBe(TEST_PAGE.page_id);
    });

    it('should update a page position', async () => {
      const response = await request(app)
        .put(`/api/pages/${TEST_PAGE.page_id}/position`)
        .send({ position: 2 })
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(response.body.position).toBe(2);
    });

    it('should delete a page', async () => {
      const response = await request(app)
        .delete(`/api/pages/${TEST_PAGE.page_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(204);
    });
  });

  describe('Blocks API', () => {
    it('should create a new block', async () => {
      const response = await request(app)
        .post('/api/blocks')
        .send({
          page_id: TEST_PAGE.page_id,
          block_type: 'text',
          content: 'Test Block',
          position: 1,
          x: 0,
          y: 0
        })
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('block_id');
      expect(response.body.page_id).toBe(TEST_PAGE.page_id);
    });

    it('should get blocks by page id', async () => {
      const response = await request(app)
        .get(`/api/blocks?page_id=${TEST_PAGE.page_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a block by id', async () => {
      const response = await request(app)
        .get(`/api/blocks/${TEST_BLOCK.block_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(response.body.block_id).toBe(TEST_BLOCK.block_id);
    });

    it('should update a block', async () => {
      const response = await request(app)
        .put(`/api/blocks/${TEST_BLOCK.block_id}`)
        .send({
          content: 'Updated Block',
          position: 2,
          x: 100,
          y: 100
        })
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('Updated Block');
    });

    it('should delete a block', async () => {
      const response = await request(app)
        .delete(`/api/blocks/${TEST_BLOCK.block_id}`)
        .set('Authorization', `Bearer ${TEST_USER.token}`);

      expect(response.status).toBe(204);
    });
  });
});
