vi.mock('../../db/connect', () => ({
  default: {
    query: vi.fn()
  }
}));

// Mock validators
vi.mock('../../middleware/validators', () => ({
  validatePageBelongsToNote: vi.fn()
}));

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TEST_USER, TEST_NOTE, TEST_PAGE } from '../setup';
import pool from '../../db/connect';
import * as pageController from '../../controllers/pageController';

describe('Page Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Setup request mock
    mockReq = {
      params: {},
      body: {}
    };
    
    // Setup response mock
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      end: vi.fn()
    };
    
    // Setup default mock responses 
    pool.query.mockImplementation((text, params) => {
      // Check note existence
      if (text.includes('SELECT * FROM notes WHERE note_id = $1')) {
        if (params[0] === TEST_NOTE.note_id) {
          return Promise.resolve({
            rows: [{ note_id: TEST_NOTE.note_id }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }

      // To Create Page
      if (text.includes('INSERT INTO pages')) {
        return Promise.resolve({
          rows: [{
            page_id: TEST_PAGE.page_id,
            note_id: params[0],
            position: params[1]
          }]
        });
      }
      
      // getPagesByNoteId
      if (text.includes('SELECT * FROM pages WHERE note_id = $1')) {
        if (params[0] === TEST_NOTE.note_id) {
          return Promise.resolve({
            rows: [{
              page_id: TEST_PAGE.page_id,
              note_id: TEST_NOTE.note_id,
              position: TEST_PAGE.position
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // getPageById
      if (text.includes('SELECT * FROM pages WHERE page_id = $1')) {
        if (params[0] === TEST_PAGE.page_id) {
          return Promise.resolve({
            rows: [{
              page_id: TEST_PAGE.page_id,
              note_id: TEST_NOTE.note_id,
              position: TEST_PAGE.position
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // updatePagePosition
      if (text.includes('UPDATE pages SET position = $1 WHERE page_id = $2')) {
        if (params[1] === TEST_PAGE.page_id) {
          return Promise.resolve({
            rows: [{
              page_id: TEST_PAGE.page_id,
              note_id: TEST_NOTE.note_id,
              position: params[0]
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // deletePage
      if (text.includes('DELETE FROM pages WHERE page_id = $1')) {
        if (params[0] === TEST_PAGE.page_id) {
          return Promise.resolve({
            rows: [{
              page_id: TEST_PAGE.page_id,
              note_id: TEST_NOTE.note_id,
              position: TEST_PAGE.position
            }]
          });
        } else {
          return Promise.resolve({ rows: [] });
        }
      }
      
      // Default response
      return Promise.resolve({ rows: [] });
    });
  });

  describe('createPage', () => {
    it('should create a page successfully', async () => {
      mockReq = {
        user: TEST_USER,
        body: { 
          note_id: TEST_NOTE.note_id,
          position: 0 
        }
      };

      await pageController.createPage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          note_id: TEST_NOTE.note_id,
        position: 0
        })
      );
    });

    it('should handle errors when noteId is invalid', async () => {
      mockReq = {
        user: TEST_USER,
        body: { 
          note_id: 999,
          position: 0 
        }
      };

      await pageController.createPage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Note not found' });
    });
  });

  describe('getPagesByNoteId', () => {
    it('should get all pages for a note', async () => {
      mockReq = {
        user: TEST_USER,
        query: { note_id: TEST_NOTE.note_id }
      };

      await pageController.getPagesByNoteId(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
        expect.objectContaining({
            page_id: TEST_PAGE.page_id,
            note_id: TEST_NOTE.note_id,
            position: TEST_PAGE.position
        })
        ])
      );
    });

    it('should return empty array for non-existent note', async () => {
      mockReq = {
        user: TEST_USER,
        query: { note_id: 999 }
      };

      await pageController.getPagesByNoteId(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getPageById', () => {
    it('should get a page by id', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: TEST_PAGE.page_id }
      };

      await pageController.getPageById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          page_id: TEST_PAGE.page_id,
          note_id: TEST_NOTE.note_id,
          position: TEST_PAGE.position
        })
      );
    });

    it('should return 404 for non-existent page', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: 999 }
      };

      await pageController.getPageById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Page not found' });
    });
  });

  describe('updatePagePosition', () => {
    it('should update page position', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: TEST_PAGE.page_id },
        body: { position: 1 }
      };

      await pageController.updatePagePosition(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          page_id: TEST_PAGE.page_id,
          note_id: TEST_NOTE.note_id,
        position: 1
        })
      );
    });

    it('should return 404 for non-existent page', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: 999 },
        body: { position: 1 }
      };

      await pageController.updatePagePosition(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Page not found' });
    });
  });

  describe('deletePage', () => {
    it('should delete a page', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: TEST_PAGE.page_id }
      };

      await pageController.deletePage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should return 404 for non-existent page', async () => {
      mockReq = {
        user: TEST_USER,
        params: { pageId: 999 }
      };

      await pageController.deletePage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Page not found' });
    });
  });
});
